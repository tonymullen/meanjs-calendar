# meanjs-calendar

An Angular.js UI Calendar module for Mean.js

This is mainly intended as an additional demo module for learners of Mean.js, in particular members of CSCI-240 at the University of Puget Sound. It is a simple integration of the [Angular UI Calendar](http://angular-ui.github.io/ui-calendar/) as a Mean.js CRUD module. I've tried to keep it as stripped down as possible to make it easy to understand, and I have added explanatory comments.

## Installation

The simplest way to install the module is to download the .zip file, unzip the directory, and place it in your `modules` directory. You will also need to make sure that the following dependencies are installed:

* [Angular UI Calendar](https://github.com/angular-ui/ui-calendar)

(This includes dependencies to jQuery, [Moment.js](http://momentjs.com/docs/), and  [FullCalendar.io](http://fullcalendar.io/download/))

Install this with Bower using `bower install --save angular-ui-calendar` to ensure it gets added to your `bower.json` file. Alternately, you can add it directly and then run `bower install`.


As with other dependencies we've seen in Mean.js, you should *not* place the script tags in the HTML by hand. This is handled automatically if your dependency paths are correctly added to `/config/assets/default.js`. Look at that file closely to understand how dependencies are added there. In addition to adding the required `.js` files, you'll also need to be sure the `fullcalendar.css` stylesheet is included under the `css` dependencies in that file.


## Demo

A demo of the module in the standard Mean.JS template app can be seen [here](https://boiling-thicket-12784.herokuapp.com/). You can add or delete public events without logging in. It is also possible to create an account or log in with login name `tester` and password `Test12345!`.
