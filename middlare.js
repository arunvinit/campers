const { campgroundSchema , reviewSchema } = require('./schema.js');
const ExpressError=require("./utils/ExpressError");
const Campground=require("./models/campground")
const Review =require("./models/review")
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be logged in');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview= (req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error'," You Don't have permission to edit/update");
        return res.redirect(`/campground/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error'," You Don't have permission to edit/update");
        return res.redirect(`/campground/${id}`);
    }
    next();
}
