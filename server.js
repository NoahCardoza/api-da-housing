const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { schema, resolvers } = require('./schema');
const { softAuthorization } = require('./middleware');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Routes
const UserRouter = require('./controllers/User');
const ListingRouter = require('./controllers/Listing');
// Application Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(softAuthorization());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
}));
// graphiql view for testing
app.get('/graphiql', expressPlayground({
  endpoint: '/graphql',
}));
app.use('/', UserRouter);
app.use('/', ListingRouter);

app.get('/', (_, res) => res.send('Index route for API-DA-HOUSING'));

app.listen(process.env.PORT || 3000, () => console.log('service started.'));

module.exports = app;
