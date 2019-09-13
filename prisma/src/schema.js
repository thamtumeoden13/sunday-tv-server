const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        publishedPosts: [Post!]!
        post(postId: ID!): Post
        postsByUser(userId: ID!): [Post!]!
        users: [User]
    }

    type Mutation {
        createUser(name: String!): User
        createDraft(title: String!, userId: ID!): Post
        publish(postId: ID!): Post
    }

    type User {
        id: ID!
        email: String
        name: String!
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        published: Boolean!
        author: User
    }
  
`;
module.exports = typeDefs;