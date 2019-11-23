'use strict';

const express = require('express');
const router = express.Router();
const db = require('../helpers/db');
const Message = db.Message,
  Chat = db.Chat,
  Conversation = db.Conversation,
  Members = db.User;
const chatService = require('../services/chat-service');
require('dotenv').config();


//Routes
router.get('/', getChatRoom);
router.get('/:name1/:name2', getConversationByName);

module.exports = router;

// get chat-room conversation
async function getChatRoom(req, res, next) {
  await Conversation.findOne({name: 'chat-room'}, function (err, conversation) {
    if (err || conversation === null) {
      const conv = new Conversation({
        name: 'chat-room',
      });
      conv.save(function(err, newConversation) {
        let response = {success: true};
        if (err) {
          return errorHandler(err);
        }
        response.msg = "Conversation retrieved successfuly";
        response.conversation = newConversation;
        res.status(200).json(response);
      })
    } else {
      Message.find({ 'conversationId': conversation._id })
        .sort('createdAt')
        .populate({
          path: "author",
          select: "prenom nom image"
        })
        .exec(function(err, messages) {
          let response = {success: true};
          if (err) {
            return errorHandler(err);
          }
          response.conversation = conversation;
          response.messages = messages;
          console.log('getChatRoom$', response);
          res.status(200).json(response);

        });
    }
  })
}

async function getConversationByName(req, res, next) {
  console.log(req.params.name1, req.params.name2);
  const participant1 = req.params.name1;
  const participant2 = req.params.name2;
  let combo1 = "" + participant1 + "-" + participant2;
  let combo2 = "" + participant2 + "-" + participant1;

  await Conversation.findOne({name: combo1}, (err, conversation1) => {
    if (err || conversation1 == null) {
      Conversation.findOne({name: combo2}, (err, conversation2) => {
        if (err || conversation2 == null) {
          Members.findOne({nom: participant1}, function (err, user1) {
            if (err || user1 == null) {
              return errorHandler(err);
            }
            Members.findOne({nom: participant2}, function (err, user2) {
              if (err || user2 == null) {
                return errorHandler(err);
              }
              let participants = [user1._id, user2._id];
              let conversation = new Conversation({
                participants: participants,
                name: "" + user1.nom + "-" + user2.nom
              });
              conversation.save(function (err, newConversation) {
                let response = {success: true};
                if (err) {
                  return errorHandler(err);
                }
                response.msg = "Conversation retrieved successfuly";
                response.conversation = newConversation;
                res.status(200).json(response);
              });
            });
          });
        } else {
          Message.find({ conversationId: conversation2._id })
            .sort('createdAt')
            .populate({
              path: 'author',
              select: 'prenom nom image'
            })
            .exec(function(err, messages) {
              if (err) {
                return errorHandler(err);
              }
              let response = {success: true};
              response.conversation = conversation2;
              response.messages = messages;
              console.log('getConversationByName', response);
              return res.status(200).json(response);
            });
          /**Message.getMessagesByConv(conversation2._id, (err, messages) => {
            if (err) {
              let error = "There was an error on getting messages";
              return callback(error);
            } else {
              let conversationObj = extend({}, conversation2);
              conversationObj.messages = messages;
              return callback(null, conversationObj);
            }
          });**/
        }
      });
    }

    else {
      Message.find({ conversationId: conversation1._id })
        .sort('createdAt')
        .populate({
          path: 'author',
          select: 'prenom nom image'
        })
        .exec(function(err, messages) {
          if (err) {
            return errorHandler(err);
          }
          let response = {success: true};
          response.conversation = conversation1;
          response.messages = messages;
          console.log('getConversationByName conv 1', response);
          return res.status(200).json(response);
        });
      /**Message.getMessagesByConv(conversation1._id, (err, messages) => {
        if (err) {
          let error = "There was an error on getting messages";
          return callback(error);
        } else {
          let conversationObj = extend({}, conversation1);
          conversationObj.messages = messages;
          return callback(null, conversationObj);
        }
      });**/
    }
  });
};
