const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {validateListing,isLoggedIn,isOwner}=require("../middleware.js");
const ListingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(ListingController.index)) //index
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
      
        wrapAsync(ListingController.createListing)//createListing
    );
  
// new route
router.get("/new",isLoggedIn,ListingController.newForm);

router
    .route("/:id")
    .get(wrapAsync(ListingController.showListing))//Show(Details of listing)
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(ListingController.update)// Update route
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(ListingController.deleteListing)//Delete route
    );


//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.editListing)
);

module.exports=router;