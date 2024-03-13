const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')



router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm); //este bloque de codigo va antes de el que busca por id porque sino toma 'new' como un id

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.showEditForm));

router.put('/:id', validateCampground, isAuthor, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;