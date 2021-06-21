const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require('cors')


require('dotenv').config();

//
const cache = require('./cache');

// schemas
var commonSchema = require('./resources/common/schema');
var commonResolvers = require('./resources/common/resolvers');
var commonQuery = require('./resources/common/query');


var teamSchema = require('./resources/team/schema');
var teamQuery = require('./resources/team/query');
var teamResolvers = require('./resources/team/resolvers');

var matchSchema = require('./resources/match/schema');
var matchQuery = require('./resources/match/query');
var matchResolvers = require('./resources/match/resolvers');

var competitionsSchema = require('./resources/competitions/schema');
var competitionsQuery = require('./resources/competitions/query');
var competitionsResolvers = require('./resources/competitions/resolvers');


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
  introspection: true,
  tracing: true,
  cacheControl: {
    defaultMaxAge: 20,
  },
});

const app = express();
app.use(cors())
server.applyMiddleware({ app });

app.get('/healthz', async (_, res) => {
  res.send('OK');
});

app.get("/cache", (req, res) => {
  const view = {
    keys: cache.keys(),
    stats: cache.getStats()
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(view, null, 2));
});

app.get("*", (req, res) => {
  res.redirect("https://github.com/JamesBliss/footballQL");
});

const port = 4000;

app.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);