angular.module('ayavyaya.controllers.expense', ['ayavyaya.services.expenseService','ionic-toast'])

.controller('ExpensesCtrl', function($scope, $state, ionicToast, ExpensesService ) {
    var appendExpenses = function(expenses) {
        angular.forEach(expenses, function(expense) {
            $scope.expensesList.push(expense);
        });
    };
    
    $scope.load = function() {
        ExpensesService.load($scope.index, $scope.pageSize).then(function (expenses){
            appendExpenses(expenses);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        }, function (err){
            if (err.status === 400)  {
                ionicToast.show(err.data.error,"middle",false,6000);
                $scope.canLoadMore = false;
            } else {
                ionicToast.show("Can't get your expenses! Please try later. We regret the inconvenience.", "middle", false, 6000);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    
    $scope.next = function() {
        if ($scope.canLoadMore) {
            $scope.index = $scope.index + $scope.pageSize;
            $scope.load();
        }
    };

//.then(function () {
//                $scope.$broadcast('scroll.refreshComplete');
//            });    
    
    $scope.refresh = function() {
        $scope.expensesList = [];
        $scope.index = 0;
        $scope.pageSize = 50;
        $scope.canLoadMore = true;
        $scope.load();        
    };
    
    $scope.expensesList = [];
    $scope.index = 0;
    $scope.pageSize = 50;
    $scope.canLoadMore = true;
    $scope.load();    
})
.controller('ExpenseCtrl', function($scope, $state) {

})
;
