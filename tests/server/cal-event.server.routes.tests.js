'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CalEvent = mongoose.model('CalEvent'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  calEvent;

/**
 * CalEvent routes tests
 */
describe('CalEvent CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    
    agent = request.agent(app);
    
    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new calendar event
    user.save(function () {
      calEvent = {
        title: 'Calendar Event'
      };

      done();
    });
  });

  it('should be able to save a calendar event if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new calEvent
        agent.post('/api/calendar')
          .send(calEvent)
          .expect(200)
          .end(function (calEventSaveErr, calEventSaveRes) {
            // Handle calEvent save error
            if (calEventSaveErr) {
              return done(calEventSaveErr);
            }

            // Get a list of calendar events
            agent.get('/api/calendar')
              .end(function (calendarGetErr, calendarGetRes) {
                // Handle calendar save error
                if (calendarGetErr) {
                  return done(calendarGetErr);
                }

                // Get calendar list
                var calEvents = calendarGetRes.body;

                // Set assertions
                (calEvents[0].user._id).should.equal(userId);
                (calEvents[0].title).should.match('Calendar Event');

                // Call the assertion callback
                done();
              });
          });
      });
  });

// Remove this test case and uncomment the two cases commented out below.
// Both tests are fully written and do not need to be modified.
// The first will succeed and the second should fail when gulp test is run,
// and succeed when the functionality has been correctly implemented.
  it('should be able to save a calendar event if not logged in', function (done) {
    agent.post('/api/calendar')
      .send(calEvent)
      .expect(200)
      .end(function (calEventSaveErr, calEventSaveRes) {
        // Call the assertion callback
        if (calEventSaveErr) {
          return done(calEventSaveErr);
        }
        done();
      });
  });

/*
  it('should be able to save a public calendar event if not logged in', function (done) {
    calEvent.public = true;
    agent.post('/api/calendar')
      .send(calEvent)
      .expect(200)
      .end(function (calEventSaveErr, calEventSaveRes) {
        // Call the assertion callback
        if (calEventSaveErr) {
          return done(calEventSaveErr);
        }
        done();
      });
  });

  it('should not be able to save a private calendar event if not logged in', function (done) {
    calEvent.public = false;
    agent.post('/api/calendar')
      .send(calEvent)
      .expect(403)
      .end(function (calEventSaveErr, calEventSaveRes) {
        // Set message assertion
        (calEventSaveRes.body.message).should.match('Must be logged in to save a private event');

        // Handle calEvent save error
        done(calEventSaveErr);
      });
  });
*/

  it('should not be able to save a calendar event if no title is provided', function (done) {
    // Invalidate title field
    calEvent.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new calEvent
        agent.post('/api/calendar')
          .send(calEvent)
          .expect(400)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Set message assertion
            (calendarSaveRes.body.message).should.match('Title cannot be blank');

            // Handle calEvent save error
            done(calendarSaveErr);
          });
      });
  });


  it('should be able to get a list of calendar events if not signed in', function (done) {
    // Create new calendar event model instance
    var calEventObj = new CalEvent(calEvent);

    // Save the calEvent
    calEventObj.save(function () {
      // Request calEvents
      request(app).get('/api/calendar')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single calendar event if not signed in', function (done) {
    // Create new calendar event model instance
    var calEventObj = new CalEvent(calEvent);

    // Save the calendar event
    calEventObj.save(function () {
      request(app).get('/api/calendar/' + calEventObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', calEvent.title);

          // Call the assertion callback
          done();
        });
    });
  });


// More tests for private/public event handling
/*
    it('should be able to get a list of private calendar events if logged in', function (done) {

    });

    it('should not be able to get a list of private calendar events if not logged in', function (done) {

    });

    it('should  be able to get a single private calendar event if logged in', function (done) {

    });

    it('should not be able to get a single private calendar event if not logged in', function (done) {

    });
  */

  afterEach(function (done) {
    User.remove().exec(function () {
      CalEvent.remove().exec(done);
    });
  });
});
