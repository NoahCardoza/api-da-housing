const { buildSchema } = require('graphql');
const Listing = require('../models/Listing');
const User = require('../models/User');

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

    type UserToken { 
        token: String
    }

    type User { 
        email: String 
        school: String 
        gender: String 
        name: String 
        favoriteListings: [ID]
        preferences: [String]
        tokens: [UserToken]
    }

    type Query {
        listings: [Listing]
        listing(listingid: ID!): Listing
        users: [User]
    }
`);

module.exports.resolvers = {
  listings: async () => Listing.find().exec(),
  listing: async ({ listingid }) => Listing.findById(listingid).exec(),
  users: async () => User.find().exec(),
};
