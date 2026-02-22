const review=require("../models/reviews");
const listing=require("../models/listing");


module.exports.addReview=async(req,res)=>{
    const reviews=req.body.reviews;
    reviews.author=req.user._id;
    let listings=await listing.findById(req.params.id);
    const newRev=new review(reviews);
    listings.reviews.push(newRev);
    await listings.save()
    await newRev.save();
    req.flash("success","Review added!");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.deleteReview=async(req,res,next)=>{
    const {id,revId}=req.params;
    const list=await listing.findById(id);
    const rev=await review.findByIdAndDelete(revId);
    list.reviews.pull(revId);
    await list.save();
    req.flash("success","Review delete!");
    res.redirect(`/listings/${id}`);
}