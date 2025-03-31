const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../Middleware.js");
const users = require("../controllers/users.js");

router
  .route("/register")
  .get(wrapAsync(users.signupPage))
  .post(wrapAsync(users.signup));

router
  .route("/login")
  .get(wrapAsync(users.loginPage))
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(users.login)
  );
router.get("/logout", wrapAsync(users.logout));

module.exports = router;
