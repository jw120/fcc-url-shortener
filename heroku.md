download heroku toolbelt

heroku login

cd deploy;
git init
git add .gitignore *
git commit -m "Initial"
heroku create
git push heroku master

heroku addons:create heroku-postgresql:hobby-dev