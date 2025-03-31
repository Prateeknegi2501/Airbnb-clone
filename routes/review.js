const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../Middleware.js");
const { newReview, deleteReview } = require("../controllers/reviews.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(newReview)
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
