#### API-DA-HOUSING 


##### Setting up project for development
Install Node Dependencies.
```sh 
    npm i 
```
Startup Mongo Instance.
```sh
sudo mongod
# macos catalina
# sudo mongod -dbpath=/usr/local/var/mongodb
```
Create .env file with the default contents in the project root. You can do this by copying `.env.example` to `.env`.
```sh 
    cp .env.example .env
```
Spin Up The Application Server.
```sh
    node server.js 
```

##### Running Unit Tests
It is good practice to run pre-existing tests 
and write new ones to make sure no functionality of the API 
is broken. 
```sh 
    npm run test
```
