'use strict';

const User = require('../models/user.model');

module.exports = {
  signup,
  login
}

 async function login(req, res){
  var user = new User(req.body);
  user.save();
  res.json(req.body);
}

module.exports.login = function(req, res){

}
