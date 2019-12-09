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
        # create_listing(name: String!, price: Float!, images: [String], description: String!, author: ID!, address: Address!): Listing!
        users: [User]
        user(userid: ID!): User
        user_login(password: String!, email: String!): String
        create_user(email: String!, school: String!, gender: String!, name: String!, password: String!): User
        teams: [Team]
        team(teamid: ID!): Team
    }
`);

module.exports.resolvers = {
  listings: async () => {
    try {
      return Listing.find().exec();
    } catch (error) {
      return error.message;
    }
  },
  listing: async ({ listingid }) => {
    try {
      return Listing.findById(listingid).exec();
    } catch (error) {
      return error.message;
    }
  },
  users: async (_, req) => {
    try {
      if (req.user) console.log(req.user);
      return User.find().exec();
    } catch (error) {
      return error.message;
    }
  },
  user: async ({ userid }, req) => {
    try {
      if (req.user) console.log(req.user);
      return User.findById(userid).exec();
    } catch (error) {
      return error.message;
    }
  },
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
  teams: async (_, req) => {
    try {
      if (req.user) {
        return Team.find().exec();
      }
      throw new Error('You must be authenticated to view Teams');
    } catch (error) {
      return error.message;
    }
  },
  team: async ({ teamid }, req) => {
    try {
      if (req.user) {
        const team = await Team.findOne({ _id: teamid, members: req.user._id }).exec();
        if (!team) throw new Error('Team does not exists or you are not a member');
        else if (team) {
          return team;
        }
      }
      throw new Error('You must be authenticated to be a Team Member');
    } catch (error) {
      return error.message;
    }
  },
};
