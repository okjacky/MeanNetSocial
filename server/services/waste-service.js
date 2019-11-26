'use strict';

//const Role = require('../helpers/roles');
const errorHandler = require('../helpers/error-handler');
const db = require('../helpers/db');
const Waste = db.Waste,
      Comment = db.Comment;
require('dotenv').config();

module.exports = {
  getAllWaste,
  getAllUserWaste,
  getOneWaste,
  sendComment,
  newWaste,
  delete: _deleteWaste
};

async function getAllWaste() {
  return await Waste.find().sort('date');
}

async function getAllUserWaste(userId) {
  await Waste.find({author: userId})
    .sort('date')
    .populate({
      path: 'author',
      select: 'prenom nom image '
    })
    .exec(function(err, wastes) {
      if (err) {
        return errorHandler(err);
      }
      return wastes
    });
}

async function getOneWaste(wasteId) {
  return await Waste.findById(wasteId)
    .sort('date')
    .populate({
      path: 'author',
      select: 'prenom nom image '
    });
}

async function sendComment(wasteId, commentData) {
  if (commentData) {
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
      return reponse;
    });
  }
}

async function newWaste(wasteData) {
  let reponse = {success : true};
  if(!wasteData) {
    reponse.success = false;
    return reponse;
  }
  const waste = new Waste({
    title: wasteData.title,
    body: wasteData.body,
    author: wasteData.author,
    image: null,
  });
  await waste.save(function(err, newWaste) {
    if(err) {
      reponse.success = false;
      reponse.msg = 'Echec d\'enregistrement de waste !';
      return reponse;
    }
    reponse.success = true;
    reponse.content = newWaste;
    console.log('waste save', reponse);
    return reponse;
  });
}

async function _deleteWaste(wasteId) {
  let reponse = {success : true};
  await Waste.find({_id: wasteId}, (err, wastes) => {
    wastes.forEach((waste) => {
      Comment.findOneAndRemove({wasteId: waste._id}, (err) => {
        if (err) {
          reponse.success = false;
          reponse.msg = 'Echec de supprimer tous des commentaires et articles'
          return reponse;
        }
      });
    })
  });
  await Waste.findOneAndRemove({_id: wasteId}, (err) => {
    if (err) {
      reponse.success = false;
      reponse.msg = 'Echec de supprimer tous des commentaires et articles'
      return reponse;
    }
    reponse.success = true;
    return reponse;
  });
}
