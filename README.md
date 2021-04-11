### Readme

### Pre-requirements

##### The server needs the following modules

- libre-office (used to generate PDF files)
- PostgreSQL 
- Node
- knex-migrate (`npm i -g knex-migrate`) Used to run the db migrations
- pm2 (`npm i -g pm2`) Used to run the server (`pm2 start build/dist/src/server.js --name green-api`)
- Setup `.env` variables (use `.env.example` as a template)
 

### In order to start the server, run the following commands

`npm install`

`npm start`

### In order to run the server in dev environment (in debug mode -> to attach a debugger), run
`npm run start-dev`


### In order to run the migrations install 
`npm i -g knex-migrate`
then run:
`knex-migrate up` to execute the migrations

Example of environment variables are located in `.env.example`. 
Create a `.env` file in the root directory (use the .env.example as a template)

The server spawns on port 3000 by default.
