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

    var self = {

      'load': function(index, pageSize) {

        var d = $q.defer();
        var params = {
          index: index,
          size: pageSize
        };
        ExpenseDataAccessService.customGET("", params).then(function(data) {
          d.resolve(data.expenses);
        }, function(err) {
          d.reject(err);
        });

        return d.promise;
      },
      'save': function(expenseRec, mode) {
        var d = $q.defer();
        var copyExpenseRec = angular.copy(expenseRec);
        copyExpenseRec.expense_date = $filter('date')(expenseRec.expense_date,
          'yyyy-MM-dd');
        if (mode === "create") {
          ExpenseDataAccessService.post(copyExpenseRec).then(function(
            addedExpense) {
            d.resolve(addedExpense);
          }, function() {
            d.reject("Something went wrong");
          });
        }
        if (mode === "update") {
          ExpenseDataAccessService.customPUT(copyExpenseRec,
            copyExpenseRec.id).then(
            function(updatedExpense) {
              d.resolve(updatedExpense);
            },
            function() {
              d.reject("Something went wrong on update");
            });
        }
        return d.promise;
      }
    }
    return self;
  });