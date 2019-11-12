
// const { ApolloServer } = require('apollo-server');
const { ApolloServer, gql } = require('apollo-server-lambda');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const { prisma } = require('./src/generated/prisma-client');
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
    // context: ({ event, context }) => {
    //     console.log("event, context", event, context, prisma)
    //     const tokenWithBearer = event.headers.authorization || ''
    //     const token = tokenWithBearer.split(' ')[1]
    //     const user = getUser(token)
    //     return {
    //         ...context.res,
    //         user,
    //         prisma, // the generated prisma client if you are using it
    //     }
    // },
    context: ({ event, context }) => {
        console.log("event, context", event, context, prisma)
        const tokenWithBearer = event.headers.authorization || ''
        const token = tokenWithBearer.split(' ')[1]
        const user = getUser(token)
        return {
            headers: event.headers,
            functionName: context.functionName,
            event,
            context,
            user,
            prisma, // the generated prisma client if you are using it
        }
    },
});

exports.graphqlHandler = server.createHandler({
    cors: {
        origin: true,
        credentials: true,
    },
});
