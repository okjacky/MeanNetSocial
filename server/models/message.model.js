'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Members = require('./user.model');

const MessageSchema = new Schema({
    conversationId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Members',
    }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

/**userSchema.index(
  {
    nom: "text",
    pseudo:"text",
    prenom: "text",

  });**/
// userSchema.index({'$**': 'text'});


module.exports = mongoose.model('Message', MessageSchema);
