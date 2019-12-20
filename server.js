const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');

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

// Custom Application Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
// Swagger Middleware Integration
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Loftly Core API',
      description: 'Helping to house and build communities.',
      contact: {
        name: 'Carlos Alba',
      },
      servers: ['http://localhost:3000/', 'https://loftly-core.aws.fhda.edu/'],
    },
  },
  apis: ['server.js', './controllers/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get('/docs.json', (_, res) => res.status(200).json(swaggerDocs));
app.get('/docs', (_, res) => res.status(200).sendFile(path.join(`${__dirname}/public/redoc.html`)));

// Routes
const AuthRouter = require('./controllers/Auth');
const UserRouter = require('./controllers/User');
const ListingRouter = require('./controllers/Listing');
const TeamRouter = require('./controllers/Team');
const FavoriteRouter = require('./controllers/Favorite');
const OrganizationRouter = require('./controllers/Organization');
// Initializing Routes as Middleware
app.use('/', AuthRouter);
app.use('/', UserRouter);
app.use('/', ListingRouter);
app.use('/', TeamRouter);
app.use('/', FavoriteRouter);
app.use('/', OrganizationRouter);

app.get('/', (_, res) => res.send('Index route for API-DA-HOUSING'));

app.listen(process.env.PORT || 3000, () => console.log('Loftly-Core Service Started! 🚀🦄 \n'));

module.exports = app;
