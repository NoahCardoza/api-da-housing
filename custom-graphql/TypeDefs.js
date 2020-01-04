const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Favorite {
    _id: ID
    source: String
    name: String
    author: User
    team: Team
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
    author: User
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
    biography: String
  }
  type ServiceProvider {
    name: String
    phone: String
    email: String
  }
  type Issue {
    _id: ID
    author: User
    team: Team
    title: String
    content: String
    date: String
    serviceProvider: ServiceProvider
  }
  type Post {
    _id: ID
    author: User
    team: Team
    title: String
    content: String
    date: String
  }
  type Team {
    _id: ID
    name: String
    members: [User]
    budget: Float
    favorites: [Favorite]
    home: Listing
    issues: [Issue]
    posts: [Post]
  }
  type Query {
    user: User
    login(email: String!, password: String!): String
    listing(id: ID!): Listing
    team(id: ID!): Team
    favorite(id: ID!): Favorite
  }
  type Mutation {
    user(
      profilePicture: String
      personalGallery: [String]
      email: String
      organization: String
      gender: String
      name: String
      favoriteListings: [ID]
      preferences: [String]
      password: String
      location: String
      verifications: [String]
      languages: [String]
      job: String
      lifeStyleBeliefs: [String]
      privateFields: [String]
      biography: String
    ): User
    listing(
      id: ID
      name: String
      price: Float
      longitude: Float
      latitude: Float
      images: [String]
      description: String
      street: String
      city: String
      zipcode: Int
    ): Listing
    team(
      id: ID
      name: String
      members: [ID]
      budget: Float
      favorites: [ID]
      home: ID
      issues: [ID]
      posts: [ID]
    ): Team
    favorite(
      id: ID
      source: String
      name: String
      team: ID
      comments: [String]
    ): Favorite
    issue(
      id: ID
      team: ID
      title: String
      content: String
      name: String
      phone: String
      email: String
    ): Issue
    post(id: ID, team: ID, title: String, content: String): Post
  }
`;

module.exports = typeDefs;
