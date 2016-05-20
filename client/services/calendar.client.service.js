(function () {
  'use strict';

  angular
    .module('calendar.services')
    .factory('CalendarService', CalendarService);

  CalendarService.$inject = ['$resource'];

  function CalendarService($resource) {
    return $resource('api/calendar/:calEventId', {
      calEventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
