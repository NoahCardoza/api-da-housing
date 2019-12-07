const { gql } = require('apollo-server');

module.exports.typeDefs = gql`
  type Query {
    hello: String!
  }
`;
