import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import { server } from './custom-graphql';

try {
  config();
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