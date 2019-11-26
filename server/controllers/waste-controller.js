'use strict';

const express = require('express');
const router = express.Router();
const db = require('../helpers/db');
const Waste = db.Waste,
  Comment = db.Comment,
  Members = db.User;
const wasteService = require('../services/waste-service');
require('dotenv').config();

//Routes
router.get('/', getAllWaste);
router.get('/:id', getAllUserWaste);
router.get('/article/:wasteId', getOneWaste);
router.get('/getComment/all/:wasteId', getComment);
router.post('/sendComment/:wasteId', sendComment);
router.post('/new', newWaste);
router.delete('/delete/:wasteId', _deleteWaste);

module.exports = router;

function getAllWaste(req, res, next) {
  console.log('getAllWaste' );
  wasteService.getAllWaste()
    .then((wastes) => {
      if (wastes) {
        res.status(200).json(wastes);
      }
    })
    .catch(err => next(err));
}

async function getAllUserWaste(req, res, next) {
  console.log('getAllUserWaste' );
  const uId = req.params.id;
  await Waste.find({author: uId})
    .sort('-date')
    .populate({
      path: 'author',
      select: 'prenom nom image '
    })
    .exec(function(err, wastes) {
      if (err) {
        return errorHandler(err);
      }

      let response = {success: true};
      response.content = wastes;
      res.status(200).json(response);
    });

}
function getOneWaste(req, res, next) {
  const wasteId = req.params.wasteId;
  wasteService.getOneWaste(wasteId)
    .then((oneWaste) => {
      res.status(200).json(oneWaste)
    })
    .catch(err => next(err));
}
async function newWaste(req, res, next) {
  const wasteDataLike = req.body;
  const wasteData = req.body.data;
  if(!wasteDataLike) {
    throw new Error('Echec d\'enregistrement de waste !$')
  }
  if(wasteDataLike.like === 1) {
    await Waste.findById(wasteDataLike.wasteId, (err, w) => {
      w.like.push({userId: wasteDataLike.userId , userNom: wasteDataLike.userNom,});
      w.save(function(err, newWaste) {
        if (err) {
          throw new Error('Echec d\'enregistrement de waste Like !');
        }
      });
      return true;

    });

  } else {
    console.log('newWaste$', wasteData)
    const waste = new Waste({
      title: wasteData.title,
      body: wasteData.body,
      author: wasteData.author,
      image: null,
    });
    await waste.save(function(err, newWaste) {
      if (err) {
        throw new Error('Echec d\'enregistrement de waste !');
      }
    })
  }

}

async function getComment(req, res, next) {
  console.log('getComment');
  const wasteId = req.params.wasteId;
  Comment.find({wasteId: wasteId})
    .sort('date')
    .populate({
      path: 'author',
      select: 'prenom nom image '
    })
    .exec(function(err, comments) {
      if (err) {
        return errorHandler(err);
      }

      let response = {success: true};
      response.content = comments;
      res.status(200).json(response);
    });
}

async function sendComment(req, res, next) {
  console.log('wc sendComment');
  const wasteId = req.params.wasteId;
  const commentData = req.body;
  if (commentData && wasteId) {
    const newComment = new Comment({
      wasteId: wasteId,
      body: commentData.body,
      author: commentData.author,
    });

    await newComment.save(function(err, comment) {
      if (err) {
        return errorHandler(err);
      }
      let reponse = {success: true};
      // reponse.content = comment
      res.status(200).json(reponse);
    });
  }

}

function _deleteWaste(req, res, next) {
  console.log('_deleteWaste:' );
  const wasteId = req.params.wasteId;
  wasteService.delete(wasteId)
    .then((reponse) => {
      res.status(200).json(reponse);
    })
    .catch(err => next(err));
}
