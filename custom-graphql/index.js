const {
  ApolloServer,
  gql,
} = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Team = require('../models/Team');

const typeDefs = gql`
  type Favorite {
    source: String
    name: String
    author: ID!
    team: ID!
    comments: [String]
  }
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
    author: User,
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
    favoriteListings: [Listing]
    preferences: [String]
    location: String
    verifications: [String]
    languages: [String]
    job: String
    lifeStyleBeliefs: [String]
    privateFields: [String]
  }
  type Team {
    _id: ID
    name: String
    members: [User]
    budget: Float
    favorites: [ID]
  }
  type Query {
    user: User
    login(email: String!, password: String!): String
    listing(id: ID!): Listing
    team(id: ID!): Team
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
     team(id: ID, name: String, members: [ID], budget: Float, favorites: [ID]): Team
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
    login: async (parent, args, _context) => {
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
    listing: async (parent, args, _context) => {
      try {
        return Listing.findById(args.id).exec();
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },
    team: async (parent, args, context) => {
      try {
        const team = await Team.findOne({
          _id: args.id,
          members: context.user._id,
        }).exec();
        return team;
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
            name,
            price,
            images,
            description,
            street,
            city,
            zipcode,
          } = args;
          return new Listing({
            author: context.user._doc._id,
            name,
            price,
            images,
            description,
            address: {
              street,
              city,
              zipcode,
            },
          }).save();
        }
        throw new Error('Unauthenticated request');
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },
    team: async (parent, args, context) => {
      if (context.user._id) {
        if (args.id) {
          const team = Team.findOne({
            id: args.id,
            members: context.user._id,
          }).exec();
          if (team) {
            return Team.findByIdAndUpdate(args.id, args).exec();
          }
        }
        return new Team(args).save();
      }
      return new Error('User not authenticated');
    },
  },
  User: {
    favoriteListings: async (parent) => Listing.find().where('_id').in(parent.favoriteListings).exec(),
  },
  Listing: {
    author: async (parent) => User.findById(parent.author).exec(),
  },
  Team: {
    members: async (parent) => User.find().where('_id').in(parent.members).exec(),
  },
};

const tokenAuthorizationMiddleware = async ({ req }) => {
  try {
    const TOKEN = (req.headers.authorization || '').replace('Bearer ', '');
    const DATA = Object.freeze(jwt.verify(TOKEN, process.env.SECRET));
    const user = await User.findOne({ _id: DATA._id, 'tokens.token': TOKEN }).exec();
    return {
      user,
    };
  } catch (error) {
    console.log(error.message);
    return {
      user: null,
    };
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: tokenAuthorizationMiddleware,
});

module.exports = {
  server,
};
