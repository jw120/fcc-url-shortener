# FreeCodeCamp URL Shortener exercise

Built around Express and Postgres. Also uses Handlebars and TypeScript.

Testing with Mocha, Chai/Expect and Fetch.

Used .catch(asyncThrow) whenever evaluating a Promise


* TOOD DO we ever use DATABASE_NAME? No - should have been tableName - now remove
* TODO Document that heroku does not get the DATABASE_NAME environment variable and therefore runs tests in the translation database
* TODO Document how to modify heroku db
* TODO Incorporoaret Howto notes on postgres and heroku into README or similar

## 1. Postgres

On macOS, postgres can be installed and started locally on the default port (`postgres://localhost:5432`) with

```bash
brew update && brew install postgres
postgres -D /usr/local/var/postgres/
createdb shortener
createdb testdb
```

which also creates the two databases used.

## 2. Source directory

To compile and test from the `src/` directory.

```bash
npm run lint && npm run compile && npm run test
```
The test needs a postgres instance to be running locally
(on the default port 5432) in which it wipes and uses the `testdb` database. The test creates and
closes its own http server instance (on port 8081).

To start the http server (on port 8085) for browser testing on `http://localhost:8085/`. This
requires a local Postgres server to be running.

```bash
npm run src-start
```

## 3. Local deploy directory

After compiling, copy all of the runtime files to the `deploy/` directory

```bash
npm run build
```

To set up the `deploy` directory for use with heroku (assuming the heroku toolbelt is installed and you are logged in via `heroku login`)
```bash
cd deploy
git init
git add .gitignore *
git commit -m "Initial"
heroku create
git push heroku master
```

To test that the server works from the runtime files
```bash
npm run build-start
```

which can be tested (using both the http server and postgres server) with
```bash
npm run build-test
``

## 4. Heroku

To use Postgres on Heroku and to provide the server with its URL for use on
its root html page (the url shown is for my heroku app)
```bash
cd deploy
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SERVER_URL=https://warm-falls-32550.herokuapp.com
```

To deploy the code to heroku
```bash
npm run deploy
```

To test the app runnng on heroku
```bash
npm run deploy-test
```


## Maintenance and miscellaneous


cd deploy
heroku pg:psql
> select * from translation;
> delete from translation;

    "local-logs": "cd deploy && heroku logs",

    Using Postgresql on Mac

```
brew update && brew install postgres
postgres -D /usr/local/var/postgres/
```

createdb shortener

Default gives
postgres://localhost:5432/shortener

psql shortener (to connect to database automatically)
\d+ shorts     (shows extended info for table shorts)
select * from shorts; (see contents of shorts)

SQL
drop table shorts; (deletes the table)

psql shortener -c "select * from shorts;"
psql shortener -c "drop table shorts;"

createdb testdb

## Our config

Database shortener
Table   translation
Fields  long
Field   short

