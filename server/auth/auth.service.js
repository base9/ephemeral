
module.exports = {
  isLoggedIn: isLoggedIn
};


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() || process.env.SKIP_LOGIN) {
    return next();
  }
  console.log('request denied; user is not logged in.')
  res.redirect('/');
}
