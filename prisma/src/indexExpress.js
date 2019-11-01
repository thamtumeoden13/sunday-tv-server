
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');


const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { prisma } = require('./generated/prisma-client');
const jwt = require('jsonwebtoken');

const getUser = token => {
    try {
        if (token) {
            return jwt.verify(token, 'my-secret-from-env-file-in-prod')
        }
        return null
    } catch (err) {
        return null
    }
}
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const tokenWithBearer = req.headers.authorization || ''
        const token = tokenWithBearer.split(' ')[1]
        const user = getUser(token)
        return {
            user,
            prisma, // the generated prisma client if you are using it
        }
    }
});
const app = express();
server.applyMiddleware({ app, path: '/' });

app.listen({ port: 8383 }, () =>
    console.log(`🚀 Server ready at http://localhost:8383${server.graphqlPath}`)
);