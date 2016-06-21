# FreeCodeCamp URL Shortener exercise

Built around Express and Postgres. Also uses Handlebars and TypeScript.

Testing with Mocha, Chai/Expect and Fetch.

## Plan of attack

* DONE Get root page rendering with handlebars (to show nice urls to our app)
* DONE Change root page rendering to use real example shortened URL
* DONE Get working with a global variable instead of db

  + DONE new route
  + DONE re-direct
  + DONE invalid URL page

* TODO Use debug instead of console
* TODO Server tests

  + DONE What should return value be for invalid/missing,
  + TODO Test valid functionality
  + TODO Avoid repitition in test fetching?

* TODO pg -  Use basic pg only - with DIY Promises/helpers

  + DONE Add debug
  + DONE Get database to work with create/insert/lookup
  + DONE What causes pause before termination - Not using pg?
  + Abstract to sqlNone, sqlOne etc
  + Reconsider db/table/field names
  + DONE work out what to do with done and connection pool (keep open, re-open?)
  + Should we use a key on the shortForm? How to handle duplicates? (INSERT .. ON CONFLICT?)
  +

* TODO Think about making entries unique
* TODO Make invalid page prettier
* TODO Think about sanitizing originals (e.g., if contains single quote, or someother injection problem)
* TODO Get working with local pg
* TODO Add to heroku including config variable to hold SERVER_URL (and support heroku local)
* TODO Add additional API - delete and list shorturls?
* DONE Migrate from typings to npm (are all available?)
* TODO Why does npm @types for isomorphic-fetch not work

## Ways to run

### 1. From local src dir

For use testing during development

```bash
npm run compile (if not compiled by VS Code's Build)
npm run src-start (which does node src/server.js)
```

### 2. From local deploy dir

To test deployment before pushing to heroku

```bash
npm run compile
npm run build
npm run local-install (which does npm install in the deploy directory)
npm run local-start (which does heroku local in the deploy directory)
```

### 3. On Heroku

After local deploy build is built

```bash
npm run deploy
```

