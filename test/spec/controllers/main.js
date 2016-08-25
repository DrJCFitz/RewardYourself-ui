'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('dashboardApp'));

  var MainCtrl,
    scope,
      mockRwysService,
      q;

    beforeEach(inject(function(_$q_){
        q = _$q_;
       mockRwysService = {
        getTopDeals: function(name) {
            var deferred = q.defer();
            return deferred.promise;
        }
        }; 
    }));
    
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    q = _$q_;
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
        rwysFactory: mockRwysService,
    });
  }));
    
describe('Initialization', function() {
    it('should initialize $scope.topDealsLoaded to false', function(){
        expect(scope.topDealsLoaded).toBe(false);
    });
    
    it('should call rwysFactory.topDeals', function(){
        spyOn(mockRwysService,'getTopDeals').and.callThrough();
        scope.init();
        expect(mockRwysService.getTopDeals).toHaveBeenCalled();
    });
});
});
