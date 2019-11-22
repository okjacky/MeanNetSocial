'use strict';

const socketIo = require('socket.io');
const errorHandler = require('../helpers/error-handler');
const db = require('../helpers/db');
const Message = db.Message,
  Conversation = db.Conversation,
  Members = db.User;
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = initialize;

const users = [];
const connections = [];

function initialize (server) {
  const io = socketIo(server, {path: '/mean-chat-app.io'});

  io.on('connection', socket => {
    connections.push(socket);
    socket.join('chat-room');

    socket.emit('welcome', {
      msg: 'Welcome to the chat server!',
    });

    socket.on('username', data => {

      console.log('username', data);
      if (data.nom) {
        socket.nom = data.nom;
        let user = { nom: socket.nom, id: socket.id , image: data.image, userId: data.userId};
        let existing = searchUser(data.nom);
        if (existing == false) {
          users.push(user);
        }

        io.emit('active', users);
        console.log('[%s] connected', socket.nom);
        console.log('<users>:', users);
      }
    });

    socket.on('getactive', () => {
      socket.emit('active', users);
    });
    /********************Conversation Handler*********************/
    socket.on('getConversationList', (userId) => {
      Conversation.find({$or:[
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
                  // console.log('io fullConversations', fullConversations);
                  socket.emit('onConversationList', fullConversations);
                }
              });
          });
        });

    });

    socket.on('deleteConversation', (conversationData) => {
      Conversation.findOne({
        $and : [
          { '_id': conversationData.conversationId }, { 'participants': conversationData.userId}
        ]}, (err, conversation) => {
        if (err) {
          return errorHandler(err);
        }
        if (conversation.participants.length > 1) {
          conversation.participants.splice(conversation.participants.indexOf(conversationData.userId), 1);
          conversation.save();
        } else {
          Conversation.deleteOne({ '_id': conversation._id }, function(err) {
            if (err) {
              return errorHandler(err);
            }
          });
        }
      });
    });
    /*************************Messages Handler**************************/
    socket.on('message', (data) => {
      console.log('user on message io', data);
      if (data.to === 'chat-room') {
        socket.broadcast.to('chat-room').emit('message', data.message);
      } else {
        let user = searchUser(data.to);
        if (user != false) {
          let instances = searchConnections(data.to);
          if (instances.length > 0) {
            for (let instance of instances) {
              console.log('instance', instance.id);
              io.to(instance.id).emit('message', data.message);
            }
            let myOtherInstances = searchConnections(socket.nom);
            if (myOtherInstances.length > 0) {
              for (let conn of myOtherInstances) {
                console.log('conn', conn.id);
                // exclude me
                if (conn !== socket) {
                  io.to(conn.id).emit('message', data.message);
                }
              }
            }
          }
        }
      }
      console.log(
        '[%s].to(%s)<< %s',
        data.message.author,
        data.to,
        data.message.content
      );
      /**
      // save the message to the database
      let message = new Message(data.message);
      Message.addMessage(message, (err, newMsg) => {}); **/
    });

    socket.on('getMessage', (conversationId) => {
      Message.find({ conversationId: conversationId })
        .sort('createdAt')
        .populate({
          path: 'author',
          select: 'prenom nom image'
        })
        .exec(function(err, messages) {
          if (err) {
            return errorHandler(err);
          }
          socket.emit('onGetMessages', messages);
        });
    });

    socket.on('disconnect', () => {
      let instances = searchConnections(socket.nom);
      if (instances.length == 1) {
        let user = searchUser(socket.nom);
        if (user != false) {
          users.splice(users.indexOf(user), 1);
        }
      }

      io.emit('active', users);
      console.log('[%s] disconnected', socket.username);
      console.log('<users>:', users);

      let connIndex = connections.indexOf(socket);
      if (connIndex > -1) {
        connections.splice(connIndex, 1);
      }
    });
  });
};



const searchUser = username => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].nom == username) {
      return users[i];
    }
  }

  return false;
};

const searchConnections = username => {
  let found = [];
  for (let conn of connections) {
    if (conn.nom == username) {
      found.push(conn);
    }
  }

  if (found.length > 0) {
    return found;
  } else {
    return false;
  }
};


