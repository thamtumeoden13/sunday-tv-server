
// const { ApolloServer, gql } = require('apollo-server-azure-functions');

// const typeDefs = require('./schema');
// const resolvers = require('./resolvers');
// const { prisma } = require('./generated/prisma-client');
// const jwt = require('jsonwebtoken');

// const getUser = token => {
//     try {
//         if (token) {
//             return jwt.verify(token, 'my-secret-from-env-file-in-prod')
//         }
//         return null
//     } catch (err) {
//         return null
//     }
// }

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: ({ req, res }) => {
//         const tokenWithBearer = req.headers.authorization || ''
//         const token = tokenWithBearer.split(' ')[1]
//         const user = getUser(token)
//         return {
//             ...res,
//             user,
//             prisma, // the generated prisma client if you are using it
//         }
//     }
// });

// server.listen({ port: 8383 })
//     .then(info => console.log(`Server started on http://localhost:${info.port}`));

const { ApolloServer, gql } = require('apollo-server-azure-functions');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();