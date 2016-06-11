angular.module('ayavyaya.services.pubsubService', [])
.service('PubSubService', function ($$rootScope) {
    var EXPENSE_CREATE = "expenseCreate";

	var self = {
        'createdExpense': function() {
        },
        'onExpenseCreate': function() {
            
        }
        
    }
    return self;
});

