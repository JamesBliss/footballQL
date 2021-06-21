const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require('cors')

require('dotenv').config();
require('now-env');

// schemas
var commonSchema = require('./common/schema');
var teamSchema = require('./team/schema');
var matchSchema = require('./match/schema');
var competitionsSchema = require('./competitions/schema');

// queries
var commonQuery = require('./common/query');
var teamQuery = require('./team/query');
var matchQuery = require('./match/query');
var competitionsQuery = require('./competitions/query');

// Mutations

// resolvers
var commonResolvers = require('./common/resolvers');
var teamResolvers = require('./team/resolvers');
var matchResolvers = require('./match/resolvers');
var competitionsResolvers = require('./competitions/resolvers');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    ${ commonQuery }
    ${ matchQuery }
    ${ teamQuery }
    ${ competitionsQuery }
  }
  ${ commonSchema }
  ${ matchSchema }
  ${ teamSchema }
  ${ competitionsSchema }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    ...commonResolvers,
    ...matchResolvers,
    ...teamResolvers,
    ...competitionsResolvers
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    apiKey: process.env.APOLLO_KEY
  },
  introspection: true,
  tracing: true,
  cacheControl: {
    defaultMaxAge: 20,
  },
});

const app = express();
app.use(cors())
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