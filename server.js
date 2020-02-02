const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { server } = require('./custom-graphql');

try {
  dotenv.config();
} catch (error) {
  console.log(error.message);
}

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// CORS Configuration
app.use(cors());
app.use(bodyParser.json());

server.applyMiddleware({
  app,
  path: '/',
  cors: true,
});

app.listen(process.env.PORT || 3000, () =>
  console.log('Loftly-Core Service Started! 🚀🦄 \n'),
);

module.exports = app;
