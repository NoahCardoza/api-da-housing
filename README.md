#### API-DA-HOUSING 

[Front End Code](https://github.com/hoangmatthew1999/da-housing-front-)

Install Node Dependencies.
```sh 
    npm i 
```
Startup Mongo Instance.
```sh
sudo mongod -dbpath=/usr/local/var/mongodb
```
Create .env file with this content in the project root. 
```sh 
    MONGO_URI = mongodb://localhost:27017/api-da-housing
```
Spin Up The Application Server.
```sh
    node server.js 
```
