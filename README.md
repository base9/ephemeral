
## Ephemeral
<img src="https://codeship.com/projects/59a737f0-1648-0132-c4e7-72c6c37b1f6e/status?branch=master" alt="Codeship Status for codeship/documentation" />

Ephemeral is a responsive browser-based app for finding and posting local events.

See the production site at [ephemeralmap.com](www.ephemeralmap.com)

## Interface
Users can scroll around the map in order to quickly see events that are happening now or very soon.  They can add comments, ratings, and photos to existing events, and can also very easily also post their own events which will then appear on the map for everyone to see.

![screen2](http://brianscoles.com/img/portfolio/ephemeral/ss3.png)

![screen1](http://brianscoles.com/img/portfolio/ephemeral/ss2.png)

## Explore the Repo
Here's a quick overview of the app's architecture, with links to sample files.

-  **Client app** is built with Ionic, Angular, and the Google Maps API.
  -  [Directory of main client files](https://github.com/base9/ephemeral/tree/master/ionic/www/app)
  -  [Main app.js](ionic/www/app/core/app.js) 
  -  [Example: Marker factory](ionic/www/app/markers/marker.factory.js)
-  **Node Server** - runs on Express.
  -  [Directory of API routes](https://github.com/base9/ephemeral/tree/master/server/api) 
  -  [Main server.js](server/index.js)
  -  [Example: Events controller](server/api/events/events.controller.js)
  -  [Example: Authentication via Passport](server/config/passport.js)
- **Databases** - our primary DB is PostgreSQL.
  - [Example schema/model: events](https://github.com/base9/ephemeral/blob/master/server/api/events/events.model.js).  The DB instantiated with Knex and then wrapped with the Bookshelf ORM.
  - Photo uploads and hosting handled via Amazon's S3.
- **Build System** - we use Gulp.
  - [Gulpfile](gulpfile.js) for live reload, sass, linting, testing, etc.
-  **Testing** - we use Mocha and Chai
  - [Test suite](test/serverSpec.js)


## Related Repos
Ephemeral relies on five other project repos, all authored in-house.

-  [Lytics](https://github.com/base9/lytics): our very own server analytics suite.  Available to anyone via `$ npm install lytics`.
-  [Splash](https://github.com/base9/splash): our welcome page.  
-  [Parser](https://github.com/base9/parser): a server that handles data scraping, language processing, and external API requests in order to populate the events database
-  [Geocoding](https://github.com/base9/geocoding): a server that handles and throttles outgoing requests to the Google Geocoding API
-  [LISTnr](https://github.com/base9/LISTnr): a Python/Django app that looks for event-related text blobs and forwards candidates to Parser.

![arch](http://brianscoles.com/misc/ephemeral_arch.png)

## Contributing
We welcome feedback, suggestions, and pull requests!  Please review our [Contribution guidelines](CONTRIBUTING.md).


## Dev setup instructions
So you want your own copy, eh?  Great!

-  Clone down this repo and the [Parser](https://github.com/base9/parser) repo separately.
-  In your terminal, run `$ npm install` in each repo's root directory.
-  Set up a local PostgreSQL instance on port 5432 and give it a database named "base9."
  - New to PostgreSQL? [Postgresapp.com](http://postgresapp.com/) makes it very easy to get started (on OSX at least).
-  run `$ gulp` in the root of each repo to initialize the local server.  By default, Ephemeral and Parser run on port 9000 and 8000 respectively.
-  Visit http://localhost:9000 in your browser to interact with the client application.