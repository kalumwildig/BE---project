# Northcoders News API

Ensure .env files are set up when repo is pulled:

In order to do this create 2 files inside the root of this project. These files are to be called ".env.test" and ".env.development". Once these are created, inside each file the following text should be added  "PGDATABASE=nc_news" for the '.env.development' file and then "PGDATABASE=nc_news_test" for the '.env.test' file. Double check that these .env files are within the .gitignore file.

Instruction for setup:

Clone Repo: 

The first step is to clone this repo. In order to do this, firstly navigate in your terminal to the file you wish for this repo to be stored locally. Once you are within this directory, use the command git clone <'https link of this repo'>. Once this is complete you should be able to open this repo. 

Next install dependencies:


- To install the testing dependencies for local testing, run the following packages in the terminal when your are within the project directory:
  - Supertest   - npm install supertest
  - Jest        - npm install jest
  - Jest-Sorted - npm install jest-sorted
