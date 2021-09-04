# OpenMusic V1
this is ther version one of the OpenMusic api

## this project was made by 
- Satria Aluh Perwira Nusa (fullstack)

## How to Install the OpenMusic V1
- create an .env file in the app root
- fill the attributes of the .env file with these variables, ane make sure you change the value of these variables
* |=================================================
- NODE_ENV = production
- PGUSER = yourPostgresUsername
- PGPASSWORD = yourPostgresPassword
- PGDATABASE = yourPostgresDatabase
- PGHOST = 127.0.0.1
- PGPORT =  5432
* |==================================================
after you create the .env file on the top, now install the app with these command 
- make sure you have nodeJS already installed
- use vscode or any other IDE 
- open the folder of the app
- now if you use the vscode and the app's folder already opened, write these command on the terminal
  * npm install
  * npm run db-create
  * npm run db-migrate-up
- after all of the command on the top has been done, you can use npm run start-dev to start the app
  * npm run start-prod
- to test the api, you can use api tester such as postman or insomnia


## all the libraries or package or dependencies that we use in this project :
- hapi
- dotenv
- joi
- nanoid
- pg
- pg-hstore
- sequelize