const {
  ApolloServer,
  gql,
} = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const Query = require('./Query');
const Mutation = require('./Mutation');
const UserFieldResolvers = require('./User');
const ListingFieldResolvers = require('./Listing');
const TeamFieldResolvers = require('./Team');
const User = require('../models/User');

const typeDefs = gql`
  type Favorite {
    source: String
    name: String
    author: ID!
    team: ID!
    comments: [String]
  }
  type GeoCoords {
    latitude: Float
    longitude: Float
  }
  type Address {
    street: String
    city: String
    zipcode: Int
    coordinates: GeoCoords
  }
  type Listing {
    _id: ID
    name: String
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
    preferences: [String], password: String,
    location: String
    verifications: [String]
    languages: [String]
    job: String
    lifeStyleBeliefs: [String]
    privateFields: [String]): User
    listing(id: ID, name: String, price: Float, longitude: Float, latitude: Float,
     images: [String], description: String, street: String, city: String, zipcode: Int): Listing
     team(id: ID, name: String, members: [ID], budget: Float, favorites: [ID]): Team
  }
`;

const resolvers = {
  Query,
  Mutation,
  User: UserFieldResolvers,
  Listing: ListingFieldResolvers,
  Team: TeamFieldResolvers,
};

const tokenAuthorizationMiddleware = async ({
  req,
}) => {
  try {
    const TOKEN = (req.headers.authorization || '').replace('Bearer ', '');
    const DATA = Object.freeze(jwt.verify(TOKEN, process.env.SECRET));
    const user = await User.findOne({
      _id: DATA._id,
      'tokens.token': TOKEN,
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
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: tokenAuthorizationMiddleware,
});

module.exports = {
  server,
};
