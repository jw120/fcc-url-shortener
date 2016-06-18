# FreeCodeCamp URL Shortener exercise

Built around Express and Postgres. Also uses Handlebars and TypeScript.

Testing with Mocha, Chai/Expect and Fetch.

## Plan of attack

* TODO Get root page rendering with handlebars (to show nice urls to our app)
* TODO Get working with a global variable
* TODO Get working with local pg




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

