# Northcoders News API

## Summary ##
This repo enables the hosting of a live backend API. It provides the data and seed files to establish test/development/production databases, and provides an app built in `Express.js` with error handling, models and controllers to enable CRUD interactions with a `PostgreSQL` database. It also provides a full Jest test suite. The test database is queried locally via Jest and the production database can be queried via **[this link](https://ty-news-api.onrender.com/api/)**.  

## Instructions ##

1. In order to establish the API, first clone this repo into a suitable file. To do this via terminal use `git clone <link_to_this_repo>`

2. Install the required dependencies `npm install --dev` will install those with devDependencies also

3. In order to run the protocol locally, we must set up our test and development databases.
    
    Create 2 files in the parent directory:  
        a) `.env.test`  
        b) `.env.development`  
    
    In each file, define the database to be used for each environment:
        a) `PGDATABASE=nc_news_test`
        b) `PGDATABASE=nc_news`  

We have configured our `connection.js` file to connect to our test database when running tests and connect to our development database otherwise. 

4. Setup and seed a database locally with the command `npm run setup-dbs` then `npm run seed`

5. Run tests using the Jest test suite installed `npm t`

### Dependencies ###
Minimum versions required to run protocol:

`Node.js v21.4.0`

`Postgres 14.10` (for Ubuntu)

