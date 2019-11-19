'use strict';

const express = require('express');
const router = express.Router();
const db = require('../helpers/db');
const Message = db.Message,
  Conversation = db.Conversation,
  Members = db.User;
const messageService = require('../services/message-service');
require('dotenv').config();

//Routes
router.get('/:id', getAllConversations);
router.get('/conversation/:conversationId', getOneConversation);
router.post('/:conversationId', sendReply);
router.post('/conversation/new', newConversation);
router.delete('/conversation/delete/:conversationId', _deleteConversation);

module.exports = router;


async function getAllConversations(req, res, next) {
  const userId = req.params.id
  await Conversation.find({$or:[
      { participants: userId },
      {name: userId},
    ]})
    .select('_id')
    .exec(function(err, conversations) {
      if (err) {
        return errorHandler(err);
      }
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
            if (err) {
              return errorHandler(err);
            }
            message.forEach((m) => fullConversations.push(m));

            ;
            if(fullConversations.length === conversations.length) {
              const reponse = {
                success: true,
                conversations: fullConversations,
              }
              return res.status(200).json(reponse);
            }
          });
      });
    });

  /**messageService.getAllConversations(req.params.id)
    .then((allConversations) => {
      console.log('mc: getall', allConversations);
      res.status(200).json(allConversations)})
    .catch((err) => {
      console.log('getall mc',err);
      res.status(500).json({ error: 'load all conversations failed!' })});**/
}

async function getOneConversation(req, res, next) {
  const conversationId = req.params.conversationId
  await Message.find({ conversationId: conversationId })
    .sort('createdAt')
    .populate({
      path: 'author',
      select: 'prenom nom image'
    })
    .exec(function(err, messages) {
      if (err) {
        return errorHandler(err);
      }
      return res.status(200).json({ msg: messages });
    });
}

function sendReply(req, res, next) {
  console.log('mc reply', req.params.conversationId, req.body);
  messageService.sendReply(req.params.conversationId, req.body)
    .then((sendSuccess) => {
      if(sendSuccess) {
        console.log('replu success', sendSuccess)
        res.status(200).json({ message: 'Reply successfully sent!' });
      }
    })
    .catch(err => res.status(500).json({ error: 'send messages failed!', err }));
}

async function newConversation(req, res, next) {
  const composedMessage = req.body;

  console.log('mc composedMessage', composedMessage);
  if(!composedMessage) {
    return;
  }
  const conversation = new Conversation({
    participants: composedMessage.participants,
  });
  await conversation.save(function(err, newConversation) {
    if (err) {
      return errorHandler(err);
    }
    const message = new Message({
      conversationId: newConversation._id,
      body: composedMessage.content,
      author: composedMessage.author
    });

    message.save(function(err, newMessage) {
      if (err) {
        return errorHandler(err);
      }
      console.log('ms: ', newMessage);
      res.status(200).json(newMessage);
    });
  });
}

function _deleteConversation(req, res, next) {
  messageService.delete(req.params.conversationId, req.body.userId)
    .then((deleteConversationSuccess) => {
      if (deleteConversationSuccess) {
        res.status(200).json({ message: 'Conversation started!', conversationId: req.params.conversationId })
      }})
    .catch(err => res.status(500).json({ error: 'new messages failed!', err }));
}
