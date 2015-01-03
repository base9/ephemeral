// This file is not currently in use.
// See server/router.js
controller = {};

controller.login = function (req, res) {
  console.log(req.body)
  console.log(req.isAuthenticated())
  res.send(200);
}

module.exports = controller;
