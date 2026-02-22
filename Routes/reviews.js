const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../util/wrapAsync.js");
const {isLoggedIn,isAuthor,validateReviews}=require("../middleware.js");
const reviewsController=require("../controller/review.js");

//post reviews  add
router.post('/',validateReviews,wrapAsync(reviewsController.addReview));

//review delete
router.delete('/:revId',isLoggedIn,isAuthor,wrapAsync(reviewsController.deleteReview));

module.exports=router;