const listings=require("./models/listing");
const reviews = require("./models/reviews");
const {listingSchema,reviewsSchema}=require("./schema");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be loogged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    const listing=await listings.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You not owner this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next()
    }
}

module.exports.isAuthor=async (req,res,next)=>{
    const {id,revId}=req.params;
    const review=await reviews.findById(revId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","you not this review author");
        return res.redirect(`/listings/${id}`);  
    }
    next();
}

module.exports.validateReviews=(req,res,next)=>{
    let {error}=reviewsSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next()
    }
}