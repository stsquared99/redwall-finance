const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphQLSchema = require('swagger-to-graphql');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');


const proxyUrl = 'http://redwall_finance_api:10010';
const pathToSwaggerSchema = './redwall.json';
const customHeaders = {}

// Initialize the app
const app = express();

graphQLSchema(pathToSwaggerSchema, proxyUrl, customHeaders).then(schema => {
  app.use('/graphql', graphqlHTTP(() => {
    return {
      schema,
      graphiql: true
    };
  }));

  // GraphiQL, a visual editor for queries
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  app.listen(3009, () => {
    console.log('Go to http://localhost:3009/graphiql to run queries!');
  });
}).catch(e => {
  console.log(e);
});