# Northcoders News API

Ensure .env files are set up when repo is pulled:

In order to do this create 2 files inside the root of this project. These files are to be called ".env.test" and ".env.development". Once these are created, inside each file the following text should be added  "PGDATABASE=<database_name_here>", with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
