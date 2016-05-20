(function () {
  'use strict';

  angular
    .module('calendar')
    .controller('CalendarController', CalendarController);

  CalendarController.$inject = ['CalendarService', '$compile', '$resource'];

  function CalendarController(CalendarService, $compile, $resource) {

    var vm = this;

    vm.calEvents = CalendarService.query(function() {
      vm.setCustomInds();
    });

/*
    vm.eventSources = [
      {
        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
        className: 'gcal-event',           // an option!
        currentTimezone: 'America/Chicago' // an option!
      }
    ];
*/

    vm.date = new Date();
    var d = vm.date.getDate();
    var m = vm.date.getMonth();
    var y = vm.date.getFullYear();
    vm.selectedDate = vm.date;
    // vm.events = [];
    /*
    vm.events = [
      { title: 'All Day Event', start: new Date(y, m, 1) },
      { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
      { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
      { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
      { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
      { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
    ];
    for (var i = 0; i < vm.events.length; i++) {
      vm.events[i].customIndex = i;
    }

    vm.calEventsExt = {
      color: '#f00',
      textColor: 'yellow',
      events: [
        { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
        { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
        { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
      ]
    };
    */

    vm.alertOnEventClick = function(date, jsEvent, view) {
      console.log(date);
      console.log(date.start.format('YYYY-MM-DD'));
      vm.alertMessage = (date.title + ' was clicked ');
      console.log(vm.alertMessage);
    };

    /* The function called when a day is clicked */
    vm.alertOnDayClick = function(clickedDate, jsEvent, view) { // clickedDate is a moment.js object
      /*
          The following lines of code handle selecting a date and highlighting the selected date.
          This is an example of directly manipulating the DOM with jQuery. The $() function
          is a jQuery function for grabbing DOM elements by their class values. The
          .removeClass and .addClass methods remove or add a class value to the DOM element,
          which is styled by CSS. The styling for the "select-highlight" class can be found
          in this module's .css file, which can be found in client/css/calendar.css. (Note that this
          .css file is loaded into the web page automatically by /config/assets/default.js)

          Directly manipulating the DOM in this way is not generally recommended when working with
          Angular.js. The preferred way would be to handle DOM manipulation in a directive, rather
          than here in the controller. However, in this case, the Angular UI calendar directive doesn't
          have this built in and I would prefer to keep my own changes in this module, rather than
          editing a third-party directive or library.
      */
      $(".select-highlight").removeClass("select-highlight");
      if (JSON.stringify(vm.selectedDate) !== JSON.stringify(clickedDate)) {
        $("td[data-date=" + clickedDate.format('YYYY-MM-DD') + "]").addClass("select-highlight");
        vm.selectedDate = clickedDate.format('YYYY-MM-DD');
      } else {
        vm.selectedDate = vm.date;
      }
      vm.alertMessage = (clickedDate.format("MMM D") + ' day was clicked ');
      console.log(vm.alertMessage);
    };

    /* alert on Drop */
    vm.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
      vm.alertMessage = ('Event Dropped to make dayDelta ' + delta);
      console.log(vm.alertMessage);
    };

    /* alert on Resize */
    vm.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
      vm.alertMessage = ('Event Resized to make dayDelta ' + delta);
      console.log(vm.alertMessage);
    };

    vm.remove = function(index) {
      vm.calEvents[index].$remove(function() {
        vm.calEvents.splice(index, 1);
        vm.setCustomInds();
      });
    };

    vm.eventRender = function(event, element, view) {
      element.attr({ 'tooltip': event.title,
                    'tooltip-append-to-body': true });
      $compile(element)(vm);
    };

    /* add custom event*/
    vm.addEvent = function() {

      /*
      We could just create a new event like the newEvent object below, using fullcalendar
      format. However, this wouldn't allow us to take advantage of Angular.js
      $resource functionality. So instead, we'll create a resource object. You can
      experiment with using this object instead of the newEvent resource object below.
      You'll see that it will still work fine for the UI calendar, but the $save()
      method won't be defined for it, so it won't be able to be saved to
      the database so simply (you'd have to set up the necesssary http POST or
      PUT requests manually).

      var newEvent = {
        title: 'Open Sesame',
        start: vm.selectedDate,
        end: vm.selectedDate,
        className: ['openSesame'],
        customIndex: vm.events.length
      }
      */

      /*
      Instead of the above, we'll create a $resource object and then give it all
      the attributes that will make it a valid fullcalendar event object. Check out
      the CalendarService() Angular service to see how this is created, which
      you'll find in /client/services/calendar.client.service.js
      */
      var newEvent = new CalendarService();
      newEvent.title = 'Open Sesame';
      newEvent.start = vm.selectedDate;
      newEvent.end = vm.selectedDate;
      newEvent.className = ['openSesame'];
      /*
      Because the newEvent object is a $resource object that is defined with the
      appropriate api URL for http requests, it's got $resource methods such as
      $save() and $update() built in. So now it's super simple to save it to the
      database just by calling newEvent.$save().
      */
      newEvent.$save(function(data) {
        console.log(data);
        newEvent._id = data._id;
        vm.calEvents.push(newEvent);
        vm.setCustomInds();
        console.log(newEvent);
      });
    };

    vm.selectedDateEvents = function(ev) {
      return moment(ev.start).format('YYYY-MM-DD') === vm.selectedDate;
    };

    vm.setCustomInds = function() {
      for (var i = 0; i < vm.calEvents.length; i++) {
        vm.calEvents[i].customIndex = i;
      }
    };

    vm.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: vm.alertOnDayClick,
        eventClick: vm.alertOnEventClick,
        eventDrop: vm.alertOnDrop,
        eventResize: vm.alertOnResize,
        eventRender: vm.eventRender
      }
    };

    // vm.eventSources = [vm.events, vm.calEventsExt];
    vm.eventSources = [vm.calEvents];


  }
}());
