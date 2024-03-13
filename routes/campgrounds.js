const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm); //este bloque de codigo va antes de el que busca por id porque sino toma 'new' como un id

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(validateCampground, isAuthor, catchAsync(campgrounds.updateCampground))
    .delete(isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.showEditForm));


module.exports = router;