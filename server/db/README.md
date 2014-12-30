##PostgreSQL DB setup steps:

1. do 'npm install'
2. download http://postgresapp.com/ and add to your applications.  Run it.
3. click elephant in your top bar, and click 'open psql'. should see a terminal prompt.
4. in psql enter:  `CREATE DATABASE base9;`
5. to clear out database:
 5a. shut down local node server
 5b. at psql prompt, enter `\c template1;` to select a database other than the one to be dropped.
 5c. then enter `DROP DATABASE base9; CREATE DATABASE base9;`
   - make sure to end lines with a semicolon or they wont work
6. note that you might see errors the first time the server spins up.  restart it once or twice until errors are gone.
7. to clear out the production DB on heroku (careful!) run this in bash: `heroku pg:reset DATABASE_URL`