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

.service('ExpensesService', function ($q, ExpenseDataAccessService) {

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
        }    
        
    }
    return self;
});

