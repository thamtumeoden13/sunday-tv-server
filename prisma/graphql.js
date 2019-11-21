
// const { ApolloServer } = require('apollo-server');
const { ApolloServer, gql,
    AuthenticationError, } = require('apollo-server-lambda');
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
        throw new AuthenticationError(
            'Authentication token is invalid, please log in',
        )
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ event, context }) => {
        const tokenWithBearer = event.headers.authorization || ''
        const token = tokenWithBearer.split(' ')[1]
        const user = getUser(token)
        // optionally block the user
        // we could also check user roles/permissions here
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
