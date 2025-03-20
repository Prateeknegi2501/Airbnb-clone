module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
   
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
