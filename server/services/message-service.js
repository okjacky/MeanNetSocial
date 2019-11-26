'use strict';

const errorHandler = require('../helpers/error-handler');
const db = require('../helpers/db');
const Message = db.Message,
      Conversation = db.Conversation,
      Members = db.User;
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  sendReply,
  delete: _deleteConversation
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

async function getAllConversations(userId) {

  // Only return one message from each conversation to display as snippet
  await Conversation.find({$or:[
      { participants: userId },
      {name: userId},
    ]})
    .select('_id name')
    .exec(function(err, conversations) {
      if (err) {
        return errorHandler(err);
      }
      console.log('conversations ms', conversations)
      // Set up empty array to hold conversations + most recent message
      let fullConversations = [];
      conversations.forEach(function(conversation) {
        Message.find({ 'conversationId': conversation._id })
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: "author",
            select: "prenom nom image"
          })
          .exec(function(err, message) {
            console.log('message ms', message);
            if (err) {
              return errorHandler(err);
            }
            fullConversations.push(message);
            if(fullConversations.length === conversations.length) {
              console.log('fullConversations ms', fullConversations);

            }
          });
      });
    });
  return {name: fullConversations};
}

async function getOneConversation(userId) {
  await Conversation.find({$or:[
      { participants: userId},

    ]})

  await Message.find({ conversationId: conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'prenom nom image'
    })
    .exec(function(err, messages) {
      if (err) {
        return errorHandler(err);
      }
      return messages
    });
}

async function newConversation(composedMessage) {

  if(!composedMessage) {
    return;
  }
  const conversation = new Conversation({
    participants: composedMessage.participant,
  });
   await conversation.save(function(err, newConversation) {
    if (err) {
      return errorHandler(err);
    }
    const message = new Message({
      conversationId: newConversation._id,
      body: composedMessage.content,
      author: composedMessage.userId
    });

    message.save(function(err, newMessage) {
      if (err) {
        return errorHandler(err);
      }
      console.log('ms: ', newMessage);
      return newMessage;
    });
  });
}

async function sendReply(conversationId, composedMessage) {
  const reply = new Message({
    conversationId: conversationId,
    body: composedMessage.content,
    author: composedMessage.sender
  });

  await reply.save(function(err, sentReply) {
    if (err) {
      return errorHandler(err);
    }
    let reponse = {success: true};
    return reponse;
  });
}

async function _deleteConversation(conversationId, userId) {
  console.log('ms delete');
  return await Conversation.deleteOne({
      $and : [
        { '_id': conversationId }, { 'participants': userId}
      ]}, function(err) {
    if (err) {
      return errorHandler(err);
    }
  });
}
