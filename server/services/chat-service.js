'use strict';

const express = require('express');
const router = express.Router();
const db = require('../helpers/db');
const Chat = db.Chat,
  Conversation = db.Conversation,
  Members = db.User;
const messageService = require('../services/message-service');
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  getChatRoom,
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_LOGIN,
    pass: process.env.GMAIL_PWD
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

async function getChatRoom() {
  await Conversation.findOne({name: 'chatRoom'})
    .select('_id')
    .exec(function(err, conversation) {
      if (err || conversation == null) {
        let chatRoom = new Conversation({name: "chatRoom"});
        chatRoom.save();
        return errorHandler(err);
      }
    })
}
