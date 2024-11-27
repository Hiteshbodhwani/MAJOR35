const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const Listing =require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const expresserror=require("../utils/expresserror.js");
const Review =require("../models/review.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
      let errmsg=error.details.map((el)=> el.message).join(",");
      throw new expresserror(400,errmsg);
    }else{
      next();
    }
};
//Reviews
 //post route
router.post("/",validateReview,isLoggedIn,wrapasync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","New review created!");
     res.redirect(`/listings/${listing._id}`);
}));
    //delete reviw route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(async(req,res)=>{
      let{id,reviewId}=req.params;
    
      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);

    req.flash("success","review deleted!");
      res.redirect(`/listings/${id}`);
})
);
 module.exports=router