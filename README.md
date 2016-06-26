# FreeCodeCamp URL Shortener exercise

Running on [Heroku](https://warm-falls-32550.herokuapp.com).

Built around Express and Postgres. Also uses Handlebars and TypeScript.
Testing with Mocha, Chai/Expect and fetch. Uses Promises extensively for the asynchronous
calls to the database. Note that we have added
`.catch(asyncThrow)` whenever evaluating a Promise to ensure that exceptions do not disappesr
silently.

## 1. Postgres

On macOS, Postgres can be installed and started locally on the default port (`postgres://localhost:5432`) with

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

To set up the `deploy` directory for use with heroku (assuming the heroku toolbelt is installed
and you are logged in via `heroku login`)
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
```

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

## Miscellaneous maintenance tips

To re-create the deploy directory after wiping it (without re-creating another heroku app)
```bash
rm -fr deploy
git clone https://git.heroku.com/warm-falls-32550.git deploy
npm run build
cd deploy
git remote rename origin heroku
```

Databases can be manipulated using `psql shortener -c command` (for the local main datavase),
`psql testdb -c command` (for the local test database) or `heroku pg:psql -c command` (for the remote heroku database, this needs to run from the `deploy/` directory).

Useful commands to use with `psql` include

```sql
\d+ -- Show the tables in the database
select * from translation;   -- Show the records in the translation table
delete from translation; -- Delete the conmtents of the translation table
```

Heroku logs can be see with
```bash
cd deploy && heroku logs
```

