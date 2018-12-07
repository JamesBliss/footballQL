const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
require('dotenv').config()
require('now-env')

// schemas
var footballSchema = require('./football/schema');
var matchSchema = require('./match/schema');

// queries
var footbalQuery = require('./football/query');
var matchQuery = require('./match/query');

// Mutations

// resolvers
var footballResolvers = require('./football/resolvers');
var matchResolvers = require('./match/resolvers');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    ${ footbalQuery }
    ${ matchQuery }
  }
  ${ footballSchema }
  ${ matchSchema }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    ...footballResolvers,
    ...matchResolvers
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    apiKey: process.env.ENGINE_KEY
  },
  introspection: true,
  tracing: true,
  cacheControl: {
    defaultMaxAge: 20,
  },
});

const app = express();

server.applyMiddleware({ app });
app.get("/", (req, res) => {
  res.redirect("/graphql");
});

const port = 4000;

app.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);