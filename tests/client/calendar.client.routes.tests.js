(function () {
  'use strict';

  describe('Calendar Route Tests', function () {
    // Initialize global variables
    var $scope,
      CalendarService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CalendarService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CalendarService = _CalendarService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('calendar');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/calendar');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('Calendar Events List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('calendar.view');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/calendar/client/views/calendar.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('calendar.view');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('calendar/');
          $rootScope.$digest();

          expect($location.path()).toBe('/calendar');
          expect($state.current.templateUrl).toBe('modules/calendar/client/views/calendar.client.view.html');
        }));
      });
    });
  });
}());
