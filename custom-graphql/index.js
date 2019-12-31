const {
  ApolloServer,
  gql,
} = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Listing = require('../models/Listing');

const typeDefs = gql`
  type Address {
    street: String
    city: String
    zipcode: Int
  }
  type Listing {
    _id: ID
    price: Float
    images: [String]
    description: String
    author: ID
    address: Address
  }
  type User {
    _id: ID
    profilePicture: String
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
    login(email: String!, password: String!): String
    listing(id: ID!): Listing
  }
  type Mutation {
    user(profilePicture: String, personalGallery: [String],
    email: String,
    organization: String,
    gender: String,
    name: String,
    favoriteListings: [ID],
    preferences: [String], password: String): User
    listing(name: String, price: Float,
     images: [String], description: String, street: String, city: String, zipcode: Int): Listing
  }
`;

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      try {
        if (!context.user) return null;
        if (!context.user.profilePicture) {
          return {
            ...context.user._doc,
            profilePicture: 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png',
          };
        }
        return context.user;
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },
    login: async (parent, args, context) => {
      try {
        const user = await User.findOne({
          email: args.email,
        });
        if (user === null) throw new Error('User not found');
        const result = await user.comparePassword(args.password);
        if (result === true) return user.generateAuthToken();
        throw new Error('Credentials Have Failed');
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },
    listing: async (parent, args, context) => {
      try {
        return Listing.findById(args.id).exec();
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },
  },
  Mutation: {
    user: async (parent, args, context) => {
      try {
        if (!context.user) {
          return new User(args).save();
        }
        return User.findByIdAndUpdate(context.user._id, args).exec();
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },
    listing: async (parent, args, context) => {
      try {
        if (context.user) {
          const {
            name, price, images, description, street, city, zipcode,
          } = args;
          return new Listing({
            author: context.user._doc._id,
            name,
            price,
            images,
            description,
            address: { street, city, zipcode },
          }).save();
        }
        throw new Error('Unauthenticated request');
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({
    req,
  }) => {
    try {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      const data = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({
        _id: data._id,
        'tokens.token': token,
      }).exec();
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
