import { ApolloServer } from 'apollo-server-express';
import Query from './Query';
import Mutation from './Mutation';
import UserFieldResolvers from './User';
import ListingFieldResolvers from './Listing';
import TeamFieldResolvers from './Team';
import FavoriteFieldResolvers from './Favorite';
import IssueFieldResolvers from './Issue';
import PostFieldResolvers from './Post';
import TypeDefs from './TypeDefs';
import { tokenAuthorizationMiddleware } from './Middleware';

const resolvers = {
  Query,
  Mutation,
  User: UserFieldResolvers,
  Listing: ListingFieldResolvers,
  Team: TeamFieldResolvers,
  Favorite: FavoriteFieldResolvers,
  Issue: IssueFieldResolvers,
  Post: PostFieldResolvers,
};

export const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers,
  context: tokenAuthorizationMiddleware,
});