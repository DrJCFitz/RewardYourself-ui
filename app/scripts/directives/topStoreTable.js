(function() {
  'use strict';
    
  angular.module('dashboardApp')
    .directive('topStoreTable', [
    function() { 
      var TopStore = function ($scope, rwysFactory, $q, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.topDealsLoaded = false;
        $scope.data = [];
        $scope.dtOptions = {
          "paging":true,
          "lengthMenu": [[5, 10, -1], [5, 10, "All"]],
          "displayLength": 5,
          "info":false,
          "filter":false,
          "order":[[1,"desc"],[0,"asc"]]
        };
        $scope.dtColumnDefs = [
          DTColumnDefBuilder.newColumnDef(0),
          DTColumnDefBuilder.newColumnDef(1)
        ];
        function handleError(response) {
            return($q.reject("API error"));
        }
        function handleSuccess(response) {
          if (response.data !== undefined && response.data.length > 0) {
            $scope.topDealsLoaded = true;
            $scope.data = response.data;              
          }
        }
        $scope.init = function() {
          rwysFactory.getTopDeals($scope.storeType)
            .then( handleSuccess, handleError);
        };
        $scope.init();
      };

      TopStore.$inject = ['$scope', 'rwysFactory', '$q', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

      return {
        restrict: 'A',
        controller: TopStore,
        scope: { 
            storeType: '@'
        },
        templateUrl: 'views/topStoreTable.html'
      };
    }
  ]);
}());