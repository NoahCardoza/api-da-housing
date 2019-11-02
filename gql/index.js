const { buildSchema } = require('graphql');
const ListingModel = require('../models/Listing');

module.exports.graphQLSchema = buildSchema(`
  type Address {
      street: String, 
      city: String, 
      zipcode: Int
  }
  type Listing {
    _id: ID!
    name: String, 
    price: Float, 
    images: [String], 
    description: String, 
    author: ID!
    address: 
  }
  type Query {
    listings: [Listing]
  }
`);

module.exports.graphQLRoot = {
  listings: async () => {
    
  },
};
