// This file is not currently in use.
// See server/router.js

module.exports = {
  login: login
};

function login (req, res) {
  //console.log(req.body);
  console.log(req.isAuthenticated());
  res.send(200);
}

