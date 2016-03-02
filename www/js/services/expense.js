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
        
        loadExpenses: function() {
            var d = $q.defer();
            ExpenseDataAccessService.get("").then(function (data) {
                d.resolve(data.expenses);
            }, function (err) {
                d.reject(err);
            });

            return d.promise;
        }    
        
    }
    return self;
})
;


/*
            var data = {"expenses": [{"category": "Utilities", "description": "Electricity charges", "frequency_id": 1, "nature": "Necessity", "subcategory_id": 23, "tags": [], "amount": 1663.0, "expense_date": "2016-02-07", "frequency": "Regular", "nature_id": 1, "category_id": 5, "id": 2520, "subcategory": "Electricity"}, {"category": "Utilities", "description": "Telephone and Internet Bill", "frequency_id": 1, "nature": "Necessity", "subcategory_id": 21, "tags": [], "amount": 1366.0, "expense_date": "2016-02-07", "frequency": "Regular", "nature_id": 1, "category_id": 5, "id": 2521, "subcategory": "Internet"}, {"category": "Transport", "description": "Auto from Silk board to home", "frequency_id": 2, "nature": "Necessity", "subcategory_id": 16, "tags": [{"id": 51, "name": "Cheat"}], "amount": 530.0, "expense_date": "2016-01-28", "frequency": "Ad hoc", "nature_id": 1, "category_id": 3, "id": 2476, "subcategory": "Fare"}, {"category": "Transport", "description": "Auto charges for buying Harinya dance stuff", "frequency_id": 2, "nature": "Necessity", "subcategory_id": 16, "tags": [], "amount": 65.0, "expense_date": "2016-01-27", "frequency": "Ad hoc", "nature_id": 1, "category_id": 3, "id": 2466, "subcategory": "Fare"}]}

*/

//.service('ExpenseDataAccessService', function() {
//    var self = {
//    
//    }
//    return self
//})


//                console.log("Something wrong");
//                ionicToast.show("Can't get your expenses! Please try later. We regret the inconvenience.", "middle", false, 6000);

//                $scope.expensesList = data.expenses
