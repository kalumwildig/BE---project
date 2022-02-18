# Northcoders News API


## Project Summary:  

This project contains endpoints for a news website that will allow users to get articles, add comments, delete comments and search news topics. Test files are contained within the project to test the endpoints and the given outputs and functions. 

## Instruction for setup:

### Clone Repo: 


The first step is to clone the repo. In order to do this, firstly navigate in your terminal to the file you wish for this repo to be stored locally. Once you are within this directory, use the command git clone <'https link of this repo'>. Once this is complete you should be able to open this repo. 

Ensure .env files are set up when repo is pulled:

In order to do this create 2 files inside the root of this project. These files are to be called ".env.test" and ".env.development". Once these are created, inside each file the following text should be added  "PGDATABASE=nc_news" for the '.env.development' file and then "PGDATABASE=nc_news_test" for the '.env.test' file. Double check that these .env files are within the .gitignore file.


### Next install dependencies:  


- Install database dependencies:
    - Postgres        - npm install pg
    - Postgres format - npm install pg-format
    - dotenv          - npm install dotenv
    - express         - npm install express


- To install the testing dependencies for local testing, run the following packages in the terminal when your are within the project directory:
    - Supertest   - npm install supertest
    - Jest        - npm install jest
    - Jest-Sorted - npm install jest-sorted
    - Husky       - npm install husky  


- Ensure that once these packages are installed, that the database is created locally and data is seeded into the database. This can be achieved by running the commands 'npm run setup-dbs' and 'npm run seed' in the terminal (as seen in the package.json file).


### Run tests:

Finally, once all the above is complete, you should then be able to run the tests. This can be achieved by running 'npm test' within the terminal. This will output all tests within the repo. To run just the endpoints tests, use 'npm test app', alternatively, to run just the util function tests, use 'npm test utils'.


