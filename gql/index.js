const { buildSchema } = require('graphql');
const ListingModel = require('../models/Listing');

module.exports.graphQLSchema = buildSchema(`
  type Listing {
      
  }
  type Query {
    hello: String
  }
`);

module.exports.graphQLRoot = { hello: () => 'Hello world!' };
