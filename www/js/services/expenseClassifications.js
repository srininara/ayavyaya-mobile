angular.module('ayavyaya.services.expenseClassficationService', ['ayavyaya.config','restangular'])

.config(['RestangularProvider', 'SERVER_BASE_URL',
    function (RestangularProvider, SERVER_BASE_URL) {
        RestangularProvider.setBaseUrl(SERVER_BASE_URL);
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

.service('ClassificationDataService', function ($q, CategoryDataAccessService, NatureDataAccessService) {

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
});

