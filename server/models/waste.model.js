'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WasteSchema = new Schema({
  title: String,
  body: String,
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Members',
  },
  like: [{userId: String, userNom: String}],
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Waste', WasteSchema);
