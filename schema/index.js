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
        _id: ID
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
        _id: ID
        name: String 
        members: [ID]
        budget: Float
        favorites: [TeamFavorite]
    }

    type Query {
        listings: [Listing]
        listing(listingid: ID!): Listing
        create_listing(name: String!, price: Float!, images: [String], description: String!, author: ID!, address: Address!): Listing
        users: [User]
        user(userid: ID!): User
        user_login(password: String!, email: String!): String
        create_user(email: String!, school: String!, gender: String!, name: String!, password: String!): User
        teams: [Team]
        team(teamid: ID!): Team
    }
`);

module.exports.resolvers = {
  listings: async () => Listing.find().exec(),
  listing: async ({ listingid }) => Listing.findById(listingid).exec(),
  create_listing: async ({
    name, price, images, description, author, address,
  }) => {
    try {
      const listing = new Listing({
        name, price, images, description, author, address,
      });
      await listing.save();
      return listing;
    } catch (error) {
      return error.message;
    }
  },
  users: async () => User.find().exec(),
  user: async ({ userid }) => User.findById(userid).exec(),
  user_login: async ({ password, email }) => {
    try {
      const user = await User.findOne({ email }).exec();
      const compare = await user.comparePassword(password);
      if (compare) return user.generateAuthToken();
      return 'Credentials Have Failed!';
    } catch (error) {
      return error.message;
    }
  },
  create_user: async ({
    email, school, gender, name, password,
  }) => {
    try {
      const user = new User({
        email, school, gender, name, password,
      });
      await user.save();
      return user;
    } catch (error) {
      return error.message;
    }
  },
  teams: async () => Team.find().exec(),
  team: async ({ teamid }) => Team.findById(teamid).exec(),
};
