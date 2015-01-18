
{<9>}![alt text](https://codeship.com/projects/22f94cc0-6aad-0132-bb19-123b90e6e43d22f94cc0-6aad-0132-bb19-123b90e6e43d/status?branch=master)


### Ephemeral

Ephemeral is a responsive browser-based app for finding and posting local events.

See the production site at [ephemeralmap.com](www.ephemeralmap.com)

(screenshot 1)
(screenshot 2)

### Interface

Users can scroll around the map, see events....


### Explore the Repo

Here's a quick overview of the app's architecture, with links to sample files.

-  **Client app** is built with Ionic, Angular, and the Google Maps API.
  -  [Root HTML file](linky)
  -  [example controller](linky)
  -  [another something to link to](linky) 
-  **Node Server** - runs on Express.
  -  [Main server.js](https://github.com/base9/ephemeral/blob/master/server/index.js)
  -  [API routes](https://github.com/base9/ephemeral/tree/master/server/api) 
  -  [Authentication via Passport](https://github.com/base9/ephemeral/blob/master/server/config/passport.js)
- **Databases** - our primary DB is PostgreSQL.
  - [Schemas here](linky).  The DB instantiated with Knex and then wrapped with the Bookshelf ORM.  
  - Photo uploads and hosting handled via Amazon's S3.
- **Build System** - we use Gulp.
  - [Gulpfile](https://github.com/base9/ephemeral/blob/master/gulpfile.js) for live reload, sass, linting, testing, etc.
-  **Testing** - we use Mocha and Chai
  - [Test suite](https://github.com/base9/ephemeral/blob/master/test/serverSpec.js)


### Related Repos
Ephemeral relies on four other repos, all authored in-house.

-  [Lytics](https://github.com/base9/lytics): our very own server analytics suite.  Avaiable to anyone via `$ npm install lytics`.
-  [Splash](https://github.com/base9/splash): our welcome page.  
-  [Parser](https://github.com/base9/parser): a server that handles data scraping, language processing, and external API requests in order to populate the events database
-  [Geocoding](https://github.com/base9/geocoding): a server that handles and throttles outgoing requests to the Google Geocoding API
-  [LISTnr](https://github.com/base9/LISTnr): a Python/Django app that looks for event-related text blobs and forwards candidates to Parser.



### Contributing

We welcome feedback, suggestions, and pull requests!  Please review our [Contribution guidelines](https://github.com/base9/ephemeral/blob/master/CONTRIBUTING.md).


### Dev setup instructions
So you want your own copy, eh?  Great!

-  Clone down this repo and the [Parser](https://github.com/base9/parser) repo separately.
-  In your terminal, run `$ npm install` in each repo's root directory.
-  Set up a local PostgreSQL instance on port 5432 and give it a database named "base9."
  - New to PostgreSQL? [Postgresapp.com](http://postgresapp.com/) makes it very easy to get started (on OSX at least).
-  run `$ gulp` in the root of each repo to initialize the local server.  By default, Ephemeral and Parser run on port 9000 and 8000 respectively.
-  Visit http://localhost:9000 in your browser to interact with the client application.