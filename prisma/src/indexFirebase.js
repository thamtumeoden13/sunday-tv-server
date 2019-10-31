// require both the firebase function package to define function   // behavior and your local server config function
// const functions = require("firebase-functions");
// const configureServer = require("./server");
// //initialize the server
// const server = configureServer();
// // create and export the api
// const api = functions.https.onRequest(server);

// module.exports = { api };

const { ApolloServer, gql } = require('apollo-server-cloud-functions');


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
    introspection: true,
    playground: true,
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

exports.handler = server.createHandler();