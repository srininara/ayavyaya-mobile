angular.module('ayavyaya.services.expenseService', ['ayavyaya.config',
  'restangular'
])

.config(['RestangularProvider', 'SERVER_BASE_URL',
  function(RestangularProvider, SERVER_BASE_URL) {
    RestangularProvider.setBaseUrl(SERVER_BASE_URL);
  }
])

.factory('ExpenseDataAccessService', ['Restangular',
    function(Restangular) {
      return Restangular.all('expenses');
    }
  ])
  .service('ExpensesService', function($q, $filter, ExpenseDataAccessService) {

    var createTagStrFromTags = function(tags) {
      var tagStr = "";
      angular.forEach(tags, function(tag, index) {
        if (index > 0) {
          tagStr = tagStr + ", "
        }
        tagStr = tagStr + tag.name
      });
      return tagStr;
    };

    var addTagStrToExpenses = function(expenses) {
      angular.forEach(expenses, function (expense, index) {
        expense.tagStr = createTagStrFromTags(expense.tags);
      });
      return expenses;
    };

    var createTag = function(expense) {
      var tagStr = expense.tagStr;
      var tags = expense.tags;
      if (tagStr) {
        var tagNames = tagStr.split(",");
        var tagsMap = {};
        var tagsDerived = []
        for (var tagIndex in tags) {
          tagsMap[tags[tagIndex].name] = tags[tagIndex].id
        }
        for (var tagNameIndex in tagNames) {
          var tagName = tagNames[tagNameIndex].trim();
          if (tagName in tagsMap) {
            var newTag = {"id": tagsMap[tagName], "name": tagName};
          } else {
            console.log("tag:" + tagName);
            var newTag = {"name": tagName};
          }
          tagsDerived.push(newTag);
        }
        expense.tags = tagsDerived;

      } else {
        expense.tags=[];
      }
    };

    var self = {

      'load': function(index, pageSize) {
        var d = $q.defer();
        if (index >= 250) {
          d.reject({
            "uiError": true,
            "errorMessage": "Scrolling too long. Try doing a different search or lookup."
          });
        } else {
          var params = {
            index: index,
            size: pageSize
          };
          ExpenseDataAccessService.customGET("", params).then(function(
            data) {
            d.resolve(addTagStrToExpenses(data.expenses));
          }, function(err) {
            d.reject(err);
          });
        };
        return d.promise;
      },
      'save': function(expenseRec, mode) {
        var d = $q.defer();
        var copyExpenseRec = angular.copy(expenseRec);
        copyExpenseRec.expense_date = $filter('date')(expenseRec.expense_date,
          'yyyy-MM-dd');
        createTag(copyExpenseRec);
        if (mode === "create") {
          ExpenseDataAccessService.post(copyExpenseRec).then(function(
            addedExpense) {
            d.resolve(addedExpense);
          }, function(err) {
            var message = err.data.message ? err.data.message :
              "Something went wrong";
            d.reject(message);
          });
        }
        if (mode === "update") {
          ExpenseDataAccessService.customPUT(copyExpenseRec,
            copyExpenseRec.id).then(
            function(updatedExpense) {
              d.resolve(updatedExpense);
            },
            function(err) {
              var message = err.data.message ? err.data.message :
                "Something went wrong on update";
              d.reject(message);
            });
        }
        return d.promise;
      }
    }
    return self;
  });
