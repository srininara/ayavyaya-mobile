angular.module('ayavyaya.controllers.expense', ['ayavyaya.services.expenseService','ionic-toast'])

.controller('ExpensesCtrl', function($scope, $state, ionicToast, ExpensesService ) {
    $scope.expensesList = [];
    $scope.loadExpenses = function() {
        ExpensesService.loadExpenses().then(function (expenses){
            
            angular.forEach(expenses, function(expense) {
                $scope.expensesList.push(expense);
            });
            
            
            
            ionicToast.show("Loaded data!", "bottom", false, 1000);
//            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function (err){
            ionicToast.show("Can't get your expenses! Please try later. We regret the inconvenience.", "middle", false, 6000);
        });
    };
    $scope.loadExpenses();
})
.controller('ExpenseCtrl', function($scope, $state) {

})
;
