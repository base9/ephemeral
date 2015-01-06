module.exports = {
  isLoggedIn: isLoggedin
};


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};
