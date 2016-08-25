(function() {
  'use strict';
    
  angular.module('dashboardApp')
    .filter('parseStoreName', function() {      
      return function(input, output){
        var splitNames = input.split(':');
        return splitNames[1];
      };
    }
  );
}());