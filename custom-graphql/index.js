const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const typeDefs = gql`
  type User {
    profilePicture: String, 
    personalGallery: [String]
    email: String
    organization: String
    gender: String 
    name: String
    favoriteListings: [ID]
    preferences: [String]
  }
  type Query {
    user: User
  }
`;

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (!context.user) return null;
      return context.user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    try {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      const data = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: data._id, 'tokens.token': token }).exec();
      console.log(user);
      return {
        user,
      };
    } catch (error) {
      console.log(error.message);
      return {
        user: null,
      };
    }
  },
});

module.exports = {
  server,
};
