'use strict';
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONN || process.env.DB_URI, { useCreateIndex: true, useNewUrlParser: true })
  .then(()=>{console.log('Successfully connected to MongoDB :)');})
  .catch(err => { console.log('Could not connect to MongoDB :(');
    process.exit();
  });

mongoose.Promise = global.Promise;

module.exports = {
  User: require('../models/user.model'),
  Chat: require('../models/chat.model'),
  Waste: require('../models/waste.model'),
  Comment: require('../models/comment.model'),
  Message: require('../models/message.model'),
  Conversation: require('../models/conversation.model'),

};
