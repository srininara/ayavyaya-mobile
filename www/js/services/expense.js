angular.module('ayavyaya.services.expenseService', ['ayavyaya.config','restangular'])

.config(['RestangularProvider', 'SERVER_BASE_URL',
    function (RestangularProvider, SERVER_BASE_URL) {
        RestangularProvider.setBaseUrl(SERVER_BASE_URL);
    }
])

.factory('ExpenseDataAccessService', ['Restangular',
    function (Restangular) {
        return Restangular.all('expenses');
    }
])

.factory('CategoryDataAccessService', ['Restangular',
    function (Restangular) {
        return Restangular.all('categories');
    }
])
.factory('NatureDataAccessService', ['Restangular',
    function (Restangular) {
        return Restangular.all('natures');
    }
])

.service('LookupDataService', function ($q, CategoryDataAccessService, NatureDataAccessService) {

	var self = {
        'categories':null,
        'natures': null,
        'loadCategories': function() {
            var d = $q.defer();
            if (self.categories != null) {
                d.resolve(self.categories);
            } else {
                CategoryDataAccessService.get("").then(function (data) {
                    self.categories = data.categories;
                    d.resolve(data.categories);
                }, function (err) {
                    d.reject(err);
                });
            };

            return d.promise;
        },
        'loadNatures': function() {
            
            var d = $q.defer();
            if (self.natures != null) {
                d.resolve(self.natures);
            } else {
                NatureDataAccessService.get("").then(function (data) {
                    self.natures = data.natures;
                    d.resolve(data.natures);
                }, function (err) {
                    d.reject(err);
                });
            };
            return d.promise;
        }
        
    }
    return self;
})

.service('ExpensesService', function ($q, $filter, ExpenseDataAccessService) {

	var self = {
        
        'load': function(index, pageSize) {
            
            var d = $q.defer();
            var params = {index:index,size:pageSize};
            ExpenseDataAccessService.customGET("", params).then(function (data) {
                d.resolve(data.expenses);
            }, function (err) {
                d.reject(err);
            });

            return d.promise;
        },
        'save': function(expenseRec, mode) {
            var d = $q.defer();
            if (mode === "create") {
                var copyExpenseRec = angular.copy(expenseRec);
                copyExpenseRec.expense_date = $filter('date')(expenseRec.expense_date, 'yyyy-MM-dd');
                ExpenseDataAccessService.post(copyExpenseRec).then(function(addedExpense){
                    d.resolve(addedExpense);
                }, function() {
                    d.reject("Something went wrong");
                });
            }
            return d.promise;
        }
        
    }
    return self;
});

