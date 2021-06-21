const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require('cors')


require('dotenv').config();

//
const cache = require('./cache');

// schemas
const { common_resolvers, common_schema } = require('./resources/common');
const { competitions_resolvers, competitions_schema } = require('./resources/competitions');
const { match_resolvers, match_schema } = require('./resources/match');
const { team_resolvers, team_schema } = require('./resources/team');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    ${ competitions_schema.queries }
    ${ match_schema.queries }
    ${ team_schema.queries }
  }
  ${ common_schema.types }
  ${ competitions_schema.types }
  ${ match_schema.types }
  ${ team_schema.types }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    ...team_resolvers.queries,
    ...match_resolvers.queries,
    ...competitions_resolvers.queries
  },
  ...common_resolvers.types
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