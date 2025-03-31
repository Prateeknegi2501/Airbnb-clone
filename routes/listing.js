const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../Middleware.js");
const listingController = require("../controllers/listings.js");
const multer= require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})

router
  .route("/")
  .get(wrapAsync(listingController.index))  //Index Route
  .post(                                    //Create Route
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)

  
  )  
  
router.get("/search", wrapAsync(listingController.search)) //Search Route

//new route
router.get("/new", isLoggedIn, listingController.newForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showForm)) //show route
  .put(
    //Update route
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    //Delete Route
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);


module.exports = router;
