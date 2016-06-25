angular.module('ayavyaya.controllers.expense', [
  'ayavyaya.services.expenseService',
  'ayavyaya.services.expenseClassficationService',
  'ionic-toast'
])

.controller('ExpensesCtrl', function($scope, $rootScope, $state, $stateParams,
  ionicToast, ExpensesService) {
  var appendExpenses = function(expenses) {
    angular.forEach(expenses, function(expense) {
      $scope.expensesList.push(expense);
    });
  };

  $scope.load = function() {
    ExpensesService.load($scope.index, $scope.pageSize).then(function(
      expenses) {
      appendExpenses(expenses);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.refreshComplete');
    }, function(err) {
      console.log(err);
      if (err.uiError) {
        ionicToast.show(err.errorMessage, "middle", false, 6000);
        $scope.canLoadMore = false;
      } else if (err.status === 400) {
        ionicToast.show(err.data.error, "middle", false, 6000);
        $scope.canLoadMore = false;
      } else {
        ionicToast.show(
          "Can't get your expenses! Please try later. We regret the inconvenience.",
          "middle", false, 6000);
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
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams,
    fromState, fromParams, options) {
    if (toState.name === 'app.expenses') {
      $scope.refresh();
    }
  });

  $scope.launchUpdate = function(expense) {
    $state.go('app.update', {
      "expenseId": expense.id,
      "currentExpense": expense
    });
  };

  $scope.copy = function(expense) {
    var copiedExpense = angular.copy(expense);
    copiedExpense.id = null;
    copiedExpense.expense_date = new Date();
    $state.go('app.create', {
      "currentExpense": copiedExpense
    });
  };

  $scope.expensesList = [];
  $scope.index = 0;
  $scope.pageSize = 50;
  $scope.canLoadMore = true;
  $scope.load();
})

.controller('ExpenseCtrl', function($scope, $rootScope, $state, $stateParams,
  $filter, ionicToast, ClassificationDataService, ExpensesService) {

  function determineCurrentExpense() {
    var currentExpense = $stateParams.currentExpense ? $stateParams.currentExpense : {}
    currentExpense.expense_date = currentExpense.expense_date ? new Date(
      currentExpense.expense_date) : new Date();
    return currentExpense;
  };

  function findApplicableSubcategory(categoryList, category) {
    var chosenCategories = $filter('filter')(categoryList, function(
      categoryItem) {
      return categoryItem.name === category.name;
    });
    return chosenCategories[0];
  };

  $scope.selectSubCategory = function(category) {
    $scope.subCategoryList = category.subcategories;
  };

  $scope.canSave = function(expenseForm) {
    return expenseForm.$dirty && expenseForm.$valid;
  };

  $scope.saveExpense = function(expenseForm) {
    if (expenseForm.$valid) {
      //TODO: Ionic loading indicator could be useful
      var mode = $state.current.name.indexOf("create", 0) >= 0 ? "create" :
        "update";
      ExpensesService.save($scope.expense, mode).then(function(
        addedExpense) {
        $state.go('app.expenses');
      }, function(err) {
        message = err ? err : "Something went wrong!";
        ionicToast.show(message, "bottom", false,
          1500);
      });
    }
  };

  $scope.expense = determineCurrentExpense();

  ClassificationDataService.loadCategories().then(function(categories) {
    $scope.categoryList = categories;
    if ($scope.expense.category) {
      var chosenCategory = findApplicableSubcategory(categories, $scope
        .expense.category);
      $scope.subCategoryList = chosenCategory.subcategories;
    }
  }, function(err) {
    ionicToast.show("Something wrong!. We regret the inconvenience.",
      "middle", false, 6000);
  });

  ClassificationDataService.loadNatures().then(function(natures) {
    $scope.natureList = natures;
  }, function(err) {
    ionicToast.show("Something wrong!. We regret the inconvenience.",
      "middle", false, 6000);
  });

});
