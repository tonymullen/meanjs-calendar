(function () {
  'use strict';

  angular
    .module('calendar.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('calendar', {
        abstract: true,
        url: '/calendar',
        template: '<ui-view/>'
      })
      .state('calendar.view', {
        url: '',
        templateUrl: 'modules/calendar/client/views/calendar.client.view.html',
        controller: 'CalendarController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Calendar Events List'
        }
      });
  }
}());
