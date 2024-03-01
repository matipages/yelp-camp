const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const {campgroundSchema} =  require('../schemas.js')
const {isLoggedIn} = require('../middleware')


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(element =>element.message).join(','); //lista los errores separados por una coma, pero no tiene importancia ya que se maneja un solo error
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

const isAuthor = async (req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', isLoggedIn, (req,res) =>{ //este bloque de codigo va antes de el que busca por id porque sino toma 'new' como un id
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next)=>{
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Succesfully made a new campground!!');
    res.redirect(`campgrounds/${campground._id}`)
}))


router.get('/:id', catchAsync(async(req, res) =>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground, msg: req.flash("success")});
}));

router.put('/:id', validateCampground, isAuthor, catchAsync(async(req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    req.flash('success', 'Succesfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isAuthor, catchAsync(async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}))

module.exports = router;