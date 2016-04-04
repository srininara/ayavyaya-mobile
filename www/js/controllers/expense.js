angular.module('ayavyaya.controllers.expense', ['ayavyaya.services.expenseService','ionic-toast'])

.controller('ExpensesCtrl', function($scope, $rootScope, $state, $stateParams, ionicToast, ExpensesService ) {
    console.log("s ctrl");
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

    $scope.refresh = function() {
        $scope.expensesList = [];
        $scope.index = 0;
        $scope.pageSize = 50;
        $scope.canLoadMore = true;
        $scope.load();        
    };
    
    // TODO: Don't like capturing the transition and reloading the entire page. Have to figure out something else if possible later.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
        if (toState.name === 'app.expenses') {
            $scope.refresh();
        }
    });

    $scope.expensesList = [];
    $scope.index = 0;
    $scope.pageSize = 50;
    $scope.canLoadMore = true;
    $scope.load();    
})

.controller('ExpenseCtrl', function($scope, $state, $stateParams, ionicToast, LookupDataService, ExpensesService) {
    $scope.expense = {};
    LookupDataService.loadCategories().then(function(categories) {
        $scope.categoryList = categories;
    }, function (err) {
        ionicToast.show("Something wrong!. We regret the inconvenience.", "middle", false, 6000);
    });
    LookupDataService.loadNatures().then(function(natures) {
        $scope.natureList = natures;
    }, function (err) {
        ionicToast.show("Something wrong!. We regret the inconvenience.", "middle", false, 6000);
    });
    
    $scope.selectSubCategory = function (category) {
        $scope.subCategoryList = category.subcategories;
    };
    
    $scope.saveExpense = function (expenseForm) {

        if (expenseForm.$valid) {
            //TODO: Ionic loading indicator could be useful
            var mode = $state.current.name.indexOf("create",0)>=0?"create":"update";            
            ExpensesService.save($scope.expense,mode).then(function (addedExpense) {
                $state.go('app.expenses');
            }, function () {
                ionicToast.show("Something went wrong!", "bottom", false, 1500);
            });
        }
        
    };


})
;