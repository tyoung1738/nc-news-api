# Northcoders News API

In order to run the protocol locally, we must set up our test and development databases.

1. Create 2 files: 
    a) .env.test
    b) .env.development
2. In each file, define the database to be used for each environment:
    a) PGDATABASE=nc_news
    b) PGDATABASE=nc_news_test
    
We have configured our connection.js file such that this will connect to our test DB for npm run test, otherwise it will connect to our development database. 