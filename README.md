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
* DONE Check behaviour is what we want (and to spec) on different error types

* TODO Add to heroku
* TODO Get server name to work on heroku - including config variable to hold SERVER_URL (and support heroku local)

* TODO Incorporoaret Howto notes on postgres and heroku into README or similar


## Ways to run

### 1. From local src dir

For use testing during development

```bash
npm run lint && npm run compile
npm run src-start # To start the server (requires a running postgres server)
npm run test # To run mocha tests (which does not require the server to be running)
```

### 2. From local deploy dir

Intermediate step - makes a copy of the runtime files in deploy/ and runs them with our usual node

```bash
npm run lint && npm run compile
npm run build # Copies required files to deploy/
npm run build-start # which does node deploy/index.js (requires a running postgres server)
npm run build-test # runs mocha tests on a running build-start server
```

### 3. Heroku local

To test deployment before pushing to heroku

```bash
npm run lint compile && npm run compile
npm run build
npm run local-install # which does npm install in the deploy directory
npm run local-start # which does heroku local in the deploy directory
npm run local-test # runs mocha tests on a running local-start server
```

### 4. On Heroku

Deployed version

```bash
npm run deploy
npm run deploy-test # runs mocha tests against the heroku remote version
```

