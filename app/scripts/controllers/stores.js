(function(){
    'use strict';
    var StoresCtrl = function ($scope, $routeParams, rwysFactory, $q) {
    	$scope.type = $routeParams.type || 'online';
    	$scope.key = $routeParams.key || null;
    	$scope.storeList = [];
      $scope.loading = true;
      $scope.error = false;
    	$scope.updateStoreView = function(passedKey) {
    		$scope.key = passedKey;
    	}
    	function handleError(response) {
        $scope.error = true;
        return($q.reject("API error"));
      }
      function handleSuccess(response) {
        if (response.data.length > 0) {
          $scope.storeList = response.data;
          $scope.loading = false;         
        } else {
          $scope.error = true;
        }
      }
      $scope.init = function() {
          rwysFactory.getMerchantsByType($scope.type)
            .then( handleSuccess, handleError);
      };
    	$scope.init();
    };

    StoresCtrl.$inject = ['$scope', '$routeParams', 'rwysFactory', '$q'];

    angular.module('dashboardApp')
      .controller('StoresCtrl', StoresCtrl);
}());