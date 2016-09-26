# meanjs-calendar

An Angular.js UI Calendar module for Mean.js

This is mainly intended as an additional demo module for learners of Mean.js, in particular members of CSCI-240 at the University of Puget Sound. It is a simple integration of the [Angular UI Calendar](http://angular-ui.github.io/ui-calendar/) as a Mean.js CRUD module. I've tried to keep it as stripped down as possible to make it easy to understand, and I have added explanatory comments.

## Installation

The simplest way to install the module is to download the .zip file, unzip the directory, and place it in your `modules` directory. You will also need to make sure that the following dependencies are installed:

* [Angular UI Calendar](https://github.com/angular-ui/ui-calendar)

(This includes dependencies to jQuery, [Moment.js](http://momentjs.com/docs/), and  [FullCalendar.io](http://fullcalendar.io/download/))

The simplest way to install the dependencies is to edit your `bower.json` file, adding

    "angular-ui-calendar": "^1.0.1"

as the last entry of the `dependencies` object.

Then add

    "jquery": "latest",

as the *first* entry of the `dependencies` object in the same file. The order here is important. The jQuery entry *must* precede the Angular.js entry.

Then run

     bower install

to install the dependencies, and then

     grunt build

to have `wiredep` scan your `bower.json` file and add your dependency paths to `/config/assets/default.js`. In addition to the required `.js` paths, you should also see `fullcalendar.css` included under the `css` dependencies in that file.

## Demo

A demo of the module in the standard Mean.JS template app can be seen [here](https://boiling-thicket-12784.herokuapp.com/). You can add or delete public events without logging in. It is also possible to create an account or log in with login name `tester` and password `Test12345!`.
