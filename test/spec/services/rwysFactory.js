(function(){
'use strict';

describe('Services: RwysDataProvider', function () {

      var $httpBackend,
        rwysFactory;
        
      // Initialize the controller and a mock scope
      beforeEach(module('dashboardApp'));
      // load the controller's module
      beforeEach(inject(function(_$httpBackend_, _rwysFactory_){
          $httpBackend = _$httpBackend_;
          rwysFactory = _rwysFactory_;
      }));
        
      it('should request the top stores', function(){
          $httpBackend.expect('GET','/stores?top=true&type=online').respond(200);
          rwysFactory.getTopDeals('online');
          expect($httpBackend.flush).not.toThrow();
      });
    });  
}());