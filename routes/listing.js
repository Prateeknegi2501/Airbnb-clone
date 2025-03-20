const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}=require("../Middleware.js")

const validateListing = (req, res, next) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Invalid Listing Data");
  }
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);
//new route
router.get("/new", isLoggedIn,async (req, res) => {
  res.render("listings/new.ejs");
});
//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("failure", "Listing not found");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);
//Create Route
router.post(
  "/",
  validateListing,isLoggedIn,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    req.flash("failure", "Something went wrong");
    res.redirect("/listings");
  })
);
//Edit Route
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("failure", "Listing not found");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);
// Update Route
router.put(
  "/:id",
  validateListing,isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", "Successfully Updated");
    req.flash("failure", "Something went wrong");
    res.redirect("/listings");
  })
);
//Delete Route
  router.delete(
    "/:id/delete",isLoggedIn,
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success", "Deleted Successfully");
      req.flash("failure", "Something went wrong");
      res.redirect("/listings");
    })
  );
module.exports = router;
