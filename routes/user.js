const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController=require("../controllers/user.js")


router
    .route("/signup")
    .get(UserController.renderSignUpform) //signup form
    .post(wrapAsync(UserController.signUp));//signup

router
    .route("/login")
    .get(UserController.renderLoginform)
    .post(saveRedirectUrl,passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
        }),
        UserController.Login
    )

router.get("/logout",UserController.Logout)
module.exports=router;