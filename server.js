const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

try {
    require('dotenv').config();
} catch(error){
    console.log(error.message);
}


const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Routes
const AuthRouter = require('./controllers/Auth');
const UserRouter = require('./controllers/User');
const ListingRouter = require('./controllers/Listing');
const TeamRouter = require('./controllers/Team');
// Application Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use('/', AuthRouter);
app.use('/', UserRouter);
app.use('/', ListingRouter);
app.use('/', TeamRouter);

app.get('/', (_, res) => res.send('Index route for API-DA-HOUSING'));

app.listen(process.env.PORT || 3000, () => console.log('service started.'));

module.exports = app;
