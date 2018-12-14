const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
require('dotenv').config();
require('now-env');

// schemas
var teamSchema = require('./team/schema');
var matchSchema = require('./match/schema');

// queries
var teamQuery = require('./team/query');
var matchQuery = require('./match/query');

// Mutations

// resolvers
var teamResolvers = require('./team/resolvers');
var matchResolvers = require('./match/resolvers');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    ${ teamQuery }
    ${ matchQuery }
  }
  ${ teamSchema }
  ${ matchSchema }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    ...teamResolvers,
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