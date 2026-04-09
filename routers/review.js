const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const {isLogin,isAuthor,validateReview}=require("../middleware.js")
const reviewController=require("../controllers/reviews.js")

//post rout
router.post("/",isLogin, validateReview, wrapAsync(reviewController.postReview));

//delete review rout
router.delete("/:reviewId",isLogin,isAuthor, wrapAsync(reviewController.deleteReview))

module.exports= router;
