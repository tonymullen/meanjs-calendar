'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * CalEvent Schema
 */
var CalEventSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  url: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    default: '',
    trim: true
  },
  allDay: Boolean,
  start: Date,
  end: Date,
  stick: { type: Boolean, default: true },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  className: [String]
});

mongoose.model('CalEvent', CalEventSchema);
