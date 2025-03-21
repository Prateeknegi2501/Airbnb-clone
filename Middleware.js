const Listing = require("./models/listing");
const Review =require("./models/reviews.js")
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
   console.log(req.originalUrl)
    req.session.redirectURL = req.originalUrl;
    req.flash("failure", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};
module.exports.isOwner=async(req,res,next)=>{
  const {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("failure","You are not the owner")
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isAuthor = async (req, res, next) => {
  const { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("failure", "You are not the author");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


module.exports.validateListing = (req, res, next) => {
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

module.exports.validateReview = (req, res, next) => {
  if (!req.body.review) {
    throw new ExpressError(400, "Invalid Review Data");
  }
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};