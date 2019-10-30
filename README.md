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
Create .env file with this content in the project root. 
```sh 
    MONGO_URI = mongodb://localhost:27017/api-da-housing
    SECRET = changeinproductionsecret
```
Spin Up The Application Server.
```sh
    node server.js 
```


