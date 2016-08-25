(function() {
  'use strict';
    
  angular.module('dashboardApp')
    .filter('calcPercentReturn', function() {      
      return function(input, output){
      	var percentVal = 0;
        if (input.limit === null && input.unit !== "%") {
        	percentVal = input.equivalentPercentage * input.value; 
        } else if (input.unit === "%") {
        	percentVal = input.value;
        }
        return parseFloat(percentVal);
      };
    }
  );
}());