authService = {};

authService.isLoggedIn = function(req, res, next) {
  console.log("Auth service reporting live");
  console.log(req.isAuthenticated())
  return next();
};

module.exports = authService;