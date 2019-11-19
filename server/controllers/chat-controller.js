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

/**
//Routes
router.get('/', getChatRoom);
router.get('/chat/:name1/:name2', getOneConversation);
router.post('/:conversationId', sendReply);
router.post('/conversation/new', newConversation);
router.delete('/conversation/delete/:conversationId', _deleteConversation);

module.exports = router;

// get chat-room conversation
function getAllConversations (req, res, next) {
    chatService.getChatRoom();

}

router.get('/', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  let response = {success: true};
  Conversation.getChatRoom((err, chatRoom) => {
    if (err || chatRoom == null) {
      response.success = false;
      response.msg = "There was an error on getting the conversation";
      res.json(response);
    } else {
      response.msg = "Conversation retrieved successfuly";
      response.conversation = chatRoom;
      res.json(response);
    }
  });
});

// get conversation
router.get('/:name1/:name2', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  let response = {success: true};
  Conversation.getConversationByName(req.params.name1, req.params.name2, (err, conversation) => {
    if (err) {
      response.success = false;
      response.msg = "There was an error on getting the conversation";
      res.json(response);
    } else {
      response.msg = "Conversation retrieved successfuly";
      response.conversation = conversation;
      res.json(response);
    }
  });
});
**/
