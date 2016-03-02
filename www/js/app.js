angular.module('ayavyaya', [
    'ionic', 
    'ayavyaya.controllers',
    'ayavyaya.services'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'
  })

  .state('app.expenseStats', {
      url: '/expenseStats',
      views: {
        'menuContent': {
          templateUrl: 'templates/expenseStats.html',
          controller: 'ExpensesStatsCtrl'
        }
      }
    })
    .state('app.expenses', {
      url: '/expenses',
      views: {
        'menuContent': {
          templateUrl: 'templates/expenses.html',
          controller: 'ExpensesCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/expenses/:expenseId',
    views: {
      'menuContent': {
        templateUrl: 'templates/expense.html',
        controller: 'ExpenseCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/expenses');
});
