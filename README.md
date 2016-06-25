# FreeCodeCamp URL Shortener exercise

Built around Express and Postgres. Also uses Handlebars and TypeScript.

Testing with Mocha, Chai/Expect and Fetch.

Used .catch(asyncThrow) whenever evaluating a Promise

## Plan of attack

* DONE Get root page rendering with handlebars (to show nice urls to our app)
* DONE Change root page rendering to use real example shortened URL
* DONE Get working with a global variable instead of db
* DONE Use debug instead of console
* DONE pg -  Use basic pg only - with DIY Promises/helpers
* DONE Server tests
* DONE Use node-fetch instead of isomorphic? (as iso just calls node) - no (as node-fetch not TS friendly)
* DONE Tidy server.ts and other files
* DONE Think about making entries unique - should long's be unique?
* DONE Add new url entry validation
* DONE Migrate from typings to npm (are all available?)

* DONE Add catches to server.ts? Catch a server in use error on startup
* DONE Use asncthrow
* DONE Make invalid page prettier - include error messages?
* TODO Check behaviour is what we want (and to spec) on different error types
* TODO Should we standardized error terminology - what is unknown/invalid/noSuch etc
* TODO Think about sanitizing originals (e.g., if contains single quote, or someother injection problem)

* TODO Add to heroku including config variable to hold SERVER_URL (and support heroku local)


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

