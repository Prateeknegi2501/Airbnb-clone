const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../Middleware.js");
const listingController = require("../controllers/listings.js");

//Index Route
router.get("/", wrapAsync(listingController.index));
//new route
router.get("/new", isLoggedIn, listingController.newForm);
//show route
router.get("/:id", wrapAsync(listingController.showForm));
//Create Route
router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(listingController.createListing)
);
//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);
// Update Route
router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync());
//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);
module.exports = router;
