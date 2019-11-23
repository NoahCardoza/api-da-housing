import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Routes
import UserRouter from './controllers/User';
import ListingRouter from './controllers/Listing';
// Application Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use('/', UserRouter);
app.use('/', ListingRouter);

app.get('/', (_, res) => res.send('Index route for API-DA-HOUSING'));

app.listen(process.env.PORT || 3000, () => console.log('service started.'));

export default app;
