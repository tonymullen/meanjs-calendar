(function () {
  'use strict';

  angular
    .module('calendar')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Calendar',
      state: 'calendar.view',
      roles: ['*']
    });


  }
}());
