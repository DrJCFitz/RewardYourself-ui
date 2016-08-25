(function() {
  'use strict';
    
  angular.module('dashboardApp')
    .filter('parsePortalName', function() {      
      return function(input, output){
        var splitNames = input.split(':');
        return splitNames[0];
      };
    }
  );
}());