download heroku toolbelt

heroku login

cd deploy;
git init
git add .gitignore *
git commit -m "Initial"
heroku create
git push heroku master

cd deploy
heroku addons:create heroku-postgresql:hobby-dev

cd deploy
heroku config:set SERVER_URL=https://warm-falls-32550.herokuapp.com
(which adds config and restarts)

cd deploy
heroku pg:psql
> select * from translation;
> delete from translation;
