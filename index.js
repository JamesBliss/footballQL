require('dotenv').config()
var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
const cors = require('cors');

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

var root = {
  ...footballResolvers,
  ...matchResolvers,
};

var schema = buildSchema(`
  type Query {
    ${ footbalQuery }
    ${ matchQuery }
  }
  ${ footballSchema }
  ${ matchSchema }
`);

const port = process.env.PORT || 4000;

// Create an express server and a GraphQL endpoint
var app = express();
app.use(cors()) // not having cors enabled will cause an access control error
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(port, () => console.log(`Express GraphQL Server Now Running On localhost:${port}/graphql`));