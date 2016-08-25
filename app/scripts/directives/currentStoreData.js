(function() {
  'use strict';
    
  angular.module('dashboardApp')
    .directive('currentStoreData', [
    function() { 
      var CurrentData = function ($scope, rwysFactory, $q, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.dataLoaded = false;
        $scope.loading = false;
        $scope.error = false;
        $scope.data = [];
        $scope.dtOptions = {
          "paging":false,
          "info":false,
          "filter":false,
          "order":[[2,"desc"]]
        };
        $scope.dtColumnDefs = [
          DTColumnDefBuilder.newColumnDef(0).notSortable(),
          DTColumnDefBuilder.newColumnDef(1).notSortable(),
          DTColumnDefBuilder.newColumnDef(2),
        ];

        var today = new Date();
        var nowToUTC = today.getTime() - today.getTimezoneOffset() * 60 * 1000; 
        $scope.date = Date.UTC(today.getUTCFullYear(),
          today.getUTCMonth(),
          ((nowToUTC < Date.UTC(today.getUTCFullYear(), 
            today.getUTCMonth(), 
            today.getUTCDate(), 
            13,30) ? 
            today.getUTCDate()-1 : 
            today.getUTCDate()))) / 1000;

        function handleError(response) {
            $scope.error = true;
            return($q.reject("API error"));
        }
        function handleSuccess(response) {
            if (response.data.length > 0) {
              $scope.dataLoaded = true;
              $scope.data = response.data;   
              $scope.loading = false;           
            } else {
              $scope.error = true;
            }
        }
        $scope.init = function() {
            $scope.loading = true;
            $scope.error = false;
            $scope.dataLoaded = false;
            rwysFactory.getMerchantsByStore($scope.storeKey, $scope.storeType)
              .then( handleSuccess, handleError);
        };
      };
      CurrentData.$inject = ['$scope', 'rwysFactory', '$q', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

      var CurrentDataLink = function($scope, $element, $attrs) {
        $scope.$watch('storeKey', function(newValue, oldValue) {
            if (newValue) {
              $scope.storeKey = newValue;
              $scope.init(); 
            }
        });
      }
      CurrentDataLink.$inject = ['$scope', 'rwysFactory', '$q'];

      return {
        restrict: 'A',
        controller: CurrentData,
        scope: { 
            storeKey: '='
        },
        link: CurrentDataLink,
        templateUrl: 'views/currentStoreData.html'
      };
    }
  ]);
}());