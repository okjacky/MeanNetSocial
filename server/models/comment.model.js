'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Members = require('./user.model');

const CommentSchema = new Schema({
  wasteId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Members',
  },
  like: {
    type: Schema.Types.ObjectId,
    ref: 'Members',
  },
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);
