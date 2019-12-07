const { buildSchema } = require('graphql');
const Listing = require('../models/Listing');

module.exports.schema = buildSchema(`
    type Address { 
        street: String 
        city: String
        zipcode: Int
    }

    type Listing { 
        _id: ID
        name: String
        price: Float
        images: [String]
        description: String
        author: ID
        address: Address
    }
    type Query {
        listings: [Listing]
        listing(listingid: ID!): Listing
    }
`);

module.exports.resolvers = {
  listings: async () => Listing.find().exec(),
  listing: async ({ listingid }) => Listing.findById(listingid).exec(),
};
