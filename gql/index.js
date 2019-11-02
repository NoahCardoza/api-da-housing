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
    address: Address
  }
  type Query {
    listings: [Listing]
  }
`);

module.exports.graphQLRoot = {
  listings: async () => {
    try {
      const listings = await ListingModel.find({}).exec();
      return listings;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
