(function(){
    var rwysEndpoint = 'http://api.rewardyourself.today:3000';
    var rwysFactory = function($http, $q) {
        var getTopDeals = function (storeType) {
            var type = storeType || "online";
            return $http.get(rwysEndpoint+"/stores/top/"+type, {});
        };

        var getMerchantsByStore = function (storeKey, storeType) {
            var type = storeType || "online";
            return $http.get(rwysEndpoint+"/stores/"+type+"/"+storeKey, {});
        }
        
        var getMerchantsByType = function (storeType) {
            var type = storeType || "online";
            return $http.get(rwysEndpoint+"/stores/"+type, {});
        }

        return {
            getTopDeals: getTopDeals,
            getMerchantsByType: getMerchantsByType,
            getMerchantsByStore: getMerchantsByStore
        };
    };

    rwysFactory.$inject = ['$http','$q'];
    angular.module('dashboardApp')
        .factory('rwysFactory', rwysFactory);
}());