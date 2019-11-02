const { buildSchema } = require('graphql');

module.exports.graphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

module.exports.graphQLRoot = { hello: () => 'Hello world!' };
