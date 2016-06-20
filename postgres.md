Using Postgresql on Mac

```
brew update && brew install postgres
postgres -D /usr/local/var/postgres/
```

createdb shortener

Default gives
postgres://localhost:5432/shortener

psql
\c shortener   (connects to database shortener)
\d+ shorts     (shows extended info for table shorts)