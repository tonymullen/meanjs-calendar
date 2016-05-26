(function () {
  'use strict';

  angular
    .module('calendar')
    .controller('CalendarController', CalendarController);

/*
Here are the dependency injections for this controller. CalendarService is the service defined in this module. This will create new calendar event resources when we add new events. Authentication holds onto information about whether the user is logged in. We'll use this information in the view to decide what to display and what not to display, so we want to attach it to the model here in the controller.
*/
  CalendarController.$inject = ['CalendarService', 'Authentication'];

  function CalendarController(CalendarService, Authentication) {

    var vm = this;

    // attach Authentication data to the model. See the view for how vm.authentication is used.
    vm.authentication = Authentication;

    /*
    the service returns a $resource object. The .query function queries the database for
    a collection of events. The function here executes when the query completes, and runs the
    setCustomInds function.
    */
    vm.calEvents = CalendarService.query(function() {
      vm.setCustomInds();

    });

/*
    vm.date = new Date();
    var d = vm.date.getDate();
    var m = vm.date.getMonth();
    var y = vm.date.getFullYear();
    vm.selectedDate = vm.date;
*/
    vm.date = moment().local();
    var d = vm.date.date();
    var m = vm.date.month();
    var y = vm.date.year();
    vm.selectedDate = vm.date;

    vm.alertOnEventClick = function(date, jsEvent, view) {
      vm.alertMessage = (date.title + ' was clicked ');
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
        vm.selectedDate = clickedDate;
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
        title: 'Coffee Break',
        start: vm.selectedDate,
        end: vm.selectedDate,
        className: ['coffeeBreak'],
        customIndex: vm.events.length
      }

      Instead of the above, we'll let our service create a $resource object and
      then give it all the attributes that will make it a valid fullcalendar
      event object. Check out the CalendarService() Angular service to see
      how this is created, which you'll find in /client/services/calendar.client.service.js
      */
      var newEvent = new CalendarService();
      newEvent.title = 'Coffee Break';
      newEvent.start = vm.selectedDate.local();
      newEvent.end = vm.selectedDate.local();
      newEvent.className = ['coffeeBreak'];

      /*
      Because the newEvent object is a $resource object that is defined with the
      appropriate api URL for http requests, it's got $resource methods such as
      $save() and $update() built in. So now it's very simple to save it to the
      database just by calling newEvent.$save(). The $resource object handles all
      the http request business for you.
      */
      newEvent.$save(function(data) {
        newEvent._id = data._id;
        vm.calEvents.push(newEvent);
        vm.setCustomInds();
      });
    };

    vm.selectedDateEvents = function(ev) {
      // console.log(moment(ev.start).format('YYYY-MM-DD'));
      // console.log(vm.selectedDate.format('YYYY-MM-DD'));
      // console.log(moment(ev.start).format('YYYY-MM-DD') === vm.selectedDate.format('YYYY-MM-DD'))
      // return moment(ev.start).format('YYYY-MM-DD') === vm.selectedDate.format('YYYY-MM-DD');
      return true;
    };

    /*
    this associates a custom "index" value for each element in the list of events. The
    index corresponds to the array index of the event. The reason this is used is that if
    the original list is filtered in the view, the resulting filtered list will have different
    indices. customIndex always refers to the index in the original array. This must be called
    any time elements are added to or deleted from vm.calEvents.
    */
    vm.setCustomInds = function() {
      for (var i = 0; i < vm.calEvents.length; i++) {
        console.log("The ith: " + i);
        console.log(vm.calEvents[i].start);
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
        eventResize: vm.alertOnResize
      }
    };

    /*
    Various event sources can be combined. See the Angular-UI-Calendar demo
    for an example of how to combine locally-stored events with a collection of
    events drawn from Google Calendar.
    */
    vm.eventSources = [vm.calEvents];
  }
}());
