const ExpressError = require('./utils/ExpressError.js');
const Campground = require('./models/campground');
const Review = require('./models/review');
const {reviewSchema, campgroundSchema} =  require('./schemas.js');



module.exports.isLoggedIn= (req, res, next) =>{
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(element =>element.message).join(','); //lista los errores separados por una coma, pero no tiene importancia ya que se maneja un solo error
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) =>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(element =>element.message).join(','); //lista los errores separados por una coma, pero no tiene importancia ya que se maneja un solo error
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}