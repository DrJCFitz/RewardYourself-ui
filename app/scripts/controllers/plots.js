'use strict';

/**
 * @ngdoc function
 * @name johnApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the johnApp
 */
(function(){
var PlotsCtrl = function ($scope, rwysFactory) {
    $scope.rwysData = rwysFactory.getDemoData();
}

PlotsCtrl.$inject = ['$scope', 'rwysFactory'];
    
angular.module('dashboardApp')
  .controller('PlotsCtrl', PlotsCtrl);    
}());
