/**
 * @ngdoc overview
 * @name johnApp
 * @description
 * # johnApp
 *
 * Main module of the application.
 */
(function(){
'use strict';
    
var routing = function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/plots', {
        templateUrl: 'views/plots.html',
        controller: 'PlotsCtrl',
        controllerAs: 'plots'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
      })
      .when('/stores/:type?/:key?', {
        templateUrl: 'views/stores.html',
        controller: 'StoresCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
};
routing.$inject = ['$routeProvider'];

angular
  .module('dashboardApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'datatables'
  ])
  .config(routing);       
}());
