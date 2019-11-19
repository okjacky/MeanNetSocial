'use strict';

const express = require('express');
const router = express.Router();
const Role = require('../helpers/roles');
const userService = require('../services/user-service');

//Routes
/**router.post('/signup', signup);
router.get('/test', test);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);**/

module.exports = router;

function test(req, res, next) {
  console.log('test:')
  res.status(404).json({msg: 'helololo'});

}
