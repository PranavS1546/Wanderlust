const express = require("express")
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const {isLogin,isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controllers/listing.js")
const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})


//index rout & create route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLogin, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing))
   
// new route
router.get("/new",isLogin,listingController.renderNewForm)

//show , update & delete route
router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(isLogin,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLogin,isOwner, wrapAsync(listingController.deleteListing))

//edit rout 
router.get("/:id/edit",isLogin,isOwner, wrapAsync(listingController.editListing))

router.get("/category/:category", wrapAsync(listingController.filterByCategory));


module.exports=router;