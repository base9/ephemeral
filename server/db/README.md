##PostgreSQL DB setup steps:

1. do 'npm install'
2. download http://postgresapp.com/ and add to your applications.  Run it.
3. click elephant in your top bar, and click 'open psql'. should see a terminal prompt.
4. in psql enter:  `CREATE DATABASE base9;`
5. note that you might see errors the first time the server spins up.  restart it once or twice until errors are gone.

* * * 

- to clear out database:
 - kill local node server process
 - at psql prompt, enter `\c template1;` to select a database other than the one to be dropped.
 - then enter `DROP DATABASE base9; CREATE DATABASE base9;`
- to clear out the production DB on Heroku run this in bash (assumes you are on a branch with the correct 'heroku' remote: `heroku pg:reset DATABASE_URL`. it will ask for confirmation before actually resetting the DB.