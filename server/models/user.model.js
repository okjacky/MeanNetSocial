'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  genre: String ,
  pseudo: String,
  prenom: { type: String, required: true },
  nom: { type: String, required: true},
  email: { type: String, unique: true, required: true },
  isEmailValidated: { type: Boolean, default: false },
  adresse: String,
  age: Number,
  presentation: String,
  preferences: String,
  password: String,
  image: String,
  role: String,
  sendRequest: [{userId: String, userNom: String, image: String}],
  request: [{userId: String, userNom: String, image: String}],
  following: [{userId: String}],
  followers: [{userId: String}],
  date: {type: Date, default: Date.now}
}, { autoIndex: false });

userSchema.set('toJSON', { virtuals: true });
userSchema.index(
  {
    nom: "text",
    pseudo:"text",
    prenom: "text",

  });
// userSchema.index({'$**': 'text'});

module.exports = mongoose.model('Members', userSchema);
