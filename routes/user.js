const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../Middleware.js");

router.get(
  "/register",
  wrapAsync(async (req, res) => {
    res.render("users/signup.ejs");
  })
);
router.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "Welcome to Airbnb");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      req.redirect("/register");
    }
  })
);
router.get(
  "/login",
  wrapAsync(async (req, res) => {
    res.render("users/login.ejs");
  })
);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome to Airbnb");

    let redirectUrl = res.locals.redirectURL || "/listings";

    res.redirect(redirectUrl);
  })
);
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logged out Successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
