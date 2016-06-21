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

