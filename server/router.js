var eventRouter = require('./api/events');

module.exports = function ( app ) {
  app.use(eventRouter);

  // static
}