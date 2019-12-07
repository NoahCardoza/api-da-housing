const { buildSchema } = require('graphql');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Team = require('../models/Team');

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
    }

    type TeamFavorite {
        source: String
        name: String 
        comments: [String]
    }

    type Team { 
        name: String 
        members: [ID]
        budget: Float
        favorites: [TeamFavorite]
    }

    type Query {
        listings: [Listing]
        listing(listingid: ID!): Listing
        users: [User]
        user(userid: ID!): User
        teams: [Team]
    }
`);

module.exports.resolvers = {
  listings: async () => Listing.find().exec(),
  listing: async ({ listingid }) => Listing.findById(listingid).exec(),
  users: async () => User.find().exec(),
  user: async ({ userid }) => User.findById(userid).exec(),
  teams: async () => Team.find().exec(),
};
