
const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { prisma } = require('./generated/prisma-client');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma
    }
});

server.listen({ port: 8383 })
    .then(info => console.log(`Server started on http://localhost:${info.port}`));