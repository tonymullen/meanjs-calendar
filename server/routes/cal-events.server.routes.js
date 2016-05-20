'use strict';

/**
 * Module dependencies
 */
var calEventsPolicy = require('../policies/cal-events.server.policy'),
  calEvents = require('../controllers/cal-events.server.controller');

module.exports = function (app) {
  // Calendar Events collection routes
  app.route('/api/calendar').all(calEventsPolicy.isAllowed)
    .get(calEvents.list)
    .post(calEvents.create);

  // Single event routes
  app.route('/api/calendar/:calEventId').all(calEventsPolicy.isAllowed)
    .get(calEvents.read)
    .put(calEvents.update)
    .delete(calEvents.delete);

  // Finish by binding the event middleware
  app.param('calEventId', calEvents.calEventByID);
};
