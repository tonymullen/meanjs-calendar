# meanjs-calendar

An Angular.js UI Calendar module for Mean.js

This is mainly intended as an additional demo module for learners of Mean.js, in particular members of CSCI-240 at the University of Puget Sound. It is a simple integration of the [Angular UI Calendar](http://angular-ui.github.io/ui-calendar/) as a Mean.js CRUD module. I've tried to keep it as stripped down as possible to make it easy to understand, and I have added explanatory comments.

## Installation

Download the `.zip` file from the [meanjs-calendar GitHub repo](https://github.com/tonymullen/meanjs-calendar). Don't clone the repo. Unzip the file and rename the directory from `meanjs-calendar-master` to `calendar`. Place the directory into the `modules` directory of your project alongside `articles`, `chat`, `core`, and `users`.

In order to ensure that the dependencies get properly installed, we need to add them to `bower.json` file. Starting at the end the `"dependencies"` object (line 18-19), add the `angular-ui-calendar` dependency, then modify the rest of the file as follows. Note the addition of `resolutions` and the modification of `overrides` to include jquery as a dependency of angular.:

      "owasp-password-strength-test": "~1.3.0",
      "angular-ui-calendar": "^1.0.1"
      },
      "resolutions": {
       "angular": "1.5.8"
      },
      "overrides": {
       "angular": {
         "dependencies": {
          "jquery": "*"
         }
       },
       "bootstrap": {
         "main": [
           "dist/css/bootstrap.css",
           "dist/css/bootstrap-theme.css",
           "less/bootstrap.less"
          ]
        }
      }
    }
<!-- .* -->
Make sure all commas are where they belong (between object elements, but not after the last element of an object).

This should ensure that the correct version of Angular is installed to handle the various dependencies on it.

Run

    bower install

to install all client dependencies.

You can use `wiredep` to add the necessary dependencies to our assets file automatically. Modify line 444 in your `gulpfile.js` file to add the `wiredep` task to the default `gulp` task, like this:

    // Run the project in development mode
    gulp.task('default', function (done) {
      runSequence('env:dev', ['copyLocalEnvConfig', 'makeUploadsDir'], 'wiredep', 'lint', ['nodemon', 'watch'], done);
    });

Finally, run

    gulp

Check your project's `config/assets/default.js` file. The `css` and `js` assets arrays should look like this:

    css: [
      // bower:css
      'public/lib/bootstrap/dist/css/bootstrap.css',
      'public/lib/bootstrap/dist/css/bootstrap-theme.css',
      'public/lib/ng-img-crop/compile/minified/ng-img-crop.css',
      'public/lib/fullcalendar/dist/fullcalendar.css',
      // endbower
    ],
    js: [
      // bower:js
      'public/lib/jquery/dist/jquery.js',
      'public/lib/angular/angular.js',
      'public/lib/angular-animate/angular-animate.js',
      'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/lib/angular-messages/angular-messages.js',
      'public/lib/angular-mocks/angular-mocks.js',
      'public/lib/angular-resource/angular-resource.js',
      'public/lib/angular-ui-router/release/angular-ui-router.js',
      'public/lib/ng-file-upload/ng-file-upload.js',
      'public/lib/ng-img-crop/compile/minified/ng-img-crop.js',
      'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
      'public/lib/moment/moment.js',
      'public/lib/fullcalendar/dist/fullcalendar.js',
      'public/lib/angular-ui-calendar/src/calendar.js',
      // endbower
    ],

## Demo

A demo of the module in the standard Mean.JS template app can be seen [here](https://meanjs-with-calendar.herokuapp.com/). You can add or delete public events without logging in. It is also possible to create an account or log in with login name `tester` and password `Test12345!`.
