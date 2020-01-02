const { ApolloServer } = require('apollo-server-express');
const Query = require('./Query');
const Mutation = require('./Mutation');
const UserFieldResolvers = require('./User');
const ListingFieldResolvers = require('./Listing');
const TeamFieldResolvers = require('./Team');
const TypeDefs = require('./TypeDefs');
const { tokenAuthorizationMiddleware } = require('./Middleware');

const resolvers = {
  Query,
  Mutation,
  User: UserFieldResolvers,
  Listing: ListingFieldResolvers,
  Team: TeamFieldResolvers,
};


const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers,
  context: tokenAuthorizationMiddleware,
});

module.exports = {
  server,
};
