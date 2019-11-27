'use strict';

const express = require('express');
const router = express.Router();
const Role = require('../helpers/roles');
const userService = require('../services/user-service');
const nodemailer = require('nodemailer');
require('dotenv').config();

//Routes
router.post('/login', login); // public route
router.post('/signup', signup);
router.get('/', getAll);
router.post('/getEmail', getEmail);
router.post('/getAmis', getAmis);
router.get('/confirmation/:token', confirmationToken);
router.get('/:id', getById);
router.put('/:id', update);
router.post('/:id/avatar', updateAvatar);
router.post('/recherche', searchItem);
router.delete('/:id', _delete);
router.post('/connexionRequest', connexionRequest);

module.exports = router;


const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SG_LOGIN,
    pass: process.env.SG_PWD
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

function login(req, res, next) {
  userService.login(req.body.email, req.body.password)
    .then(function (user) {
      res.json(user);
    })
    .catch(err => next(err));
}

function signup(req, res, next) {
  userService.signup(req.body)
    .then(function (isMailUnique) {
      if(isMailUnique) {
        res.json(isMailUnique)
      }else {res.json({msg: 'recu'});

      }
    })
    .catch(err => next(err));
  /**const message = {
    from: 'noreply@netSocial.com',
    to: req.body.email,
    subject: 'NetSocial vous remercie ',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
  };
  transporter.sendMail(message, (err, info) => {
    if (err) {
      return console.log('sendMail error: %s', err);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });**/
}

function getAll(req, res, next) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getEmail(req, res, next) {
  userService.getEmail(req.body)
    .then((email) => {
      if(!email) {
        // TODO : Bug du callback US
        return res.status(200).json(req.body);
      } else {
        return res.status(404).json({
          msg: "email not found with email: " + req.body.email
        });
      }
    })
    .catch(err => next(err));
}

function getAmis(req, res, next) {
  console.log('UC getAmis', req.body);
  userService.getAmis(req.body)
    .then((arrayAmis) => {
      if(arrayAmis) {
        console.log('UC getAmis if', arrayAmis);
        // TODO : Bug du callback US
        return res.status(200).json(arrayAmis);
      } else {
        return res.status(404).json({
          msg: "Echec de trouver vos amis "
        });
      }
    })
    .catch(err => next(err));
}

function confirmationToken(req, res, next) {
  userService.confirmationToken(req.params.token)
    .then((tokenUser) => {
      if(!tokenUser) {
        return res.status(404).json({
          msg: "Token invalid && User not found with id "
        });
      }
      res.json(tokenUser);
    })
    .catch(err => next(err));
}

function getById(req, res, next) {
  console.log('uc:', req.params.id );
  userService.getById(req.params.id)
    .then((user) => {
      if(!user) {
        return res.status(404).json({
          msg: "User not found with id " + req.params.id
        });
      }
      res.json(user);
    })
    .catch(err => next(err));
}

function update(req, res, next) {
  userService.update(req.params.id, req.body)
    .then((updatedUser) => {
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(400).json({message: 'Aïe ! Email existe déjà ou Utilisateur inexistant'})
      }})
    .catch(err => next(err));
}

function updateAvatar(req, res, next) {
  console.log('updateAvatar:', req.files.avatar);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({message: 'Aïe ! le chargement a échoué'});
  }
  userService.updateAvatar(req.params.id, req.files.avatar)
    .then((updatedAvatar) => {
      if (updatedAvatar) {
        console.log('UC updatedAvatar:', updatedAvatar);
        res.json(updatedAvatar);
      } else {
        res.status(400).json({message: 'Aïe ! la sauvegarde de la photo a échouée'})
      }})
    .catch(err => next(err));
}

function searchItem(req, res, next) {
  console.log('uc searchItem', req.body);
  userService.searchItem(req.body.textSearch)
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log('uc error', err);
      next(err);
    })
}

function _delete(req, res, next) {
  userService.delete(req.params.id)
    .then((success) => {
      console.log('x', success);
      res.status(200).json(success);
    })
    .catch(err => next(err));
}

function connexionRequest(req, res, next) {
  console.log('uc connexionRequest', req.body);
  userService.connexionRequest(req.body)
    .then((user) => {
      console.log('uc connexionRequest user', user);
      res.json(user);
    })
    .catch((err) => {
      next(err);
    })
}
