const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        # publishedPosters: [Poster!]!
        # poster(postId: ID!): Poster
        # postersByUser(userId: ID!): User
        # users: [User!]!
        # user(userId: ID!): User
        # posters:[Poster!]!
        # poster(posterId: ID!): Poster
        deaneries:[Deanery!]!
        deanery(deaneryId: ID!): Deanery
        dioceses:[Diocese!]!
        diocese(dioceseId: ID!): Diocese
        deaneriesOfDiocese(dioceseId: ID!): Diocese
        currentUser: User!
    }

    type Mutation {
        # createUser(email: String!, name: String): User
        # createPoster(name: String!, userId: ID!, title: String!): Poster 
        # createDraft(title: String!, userId: ID!): Post
        # publish(postId: ID!): Post
        createDeanery(name: String!, shortName: String, dioceseId: ID!): Deanery
        createDiocese(name: String!, shortName: String): Diocese
        signUp(email: String!, password: String!): User!
        signIn(email: String!, password: String!): LoginResponse!
        signOut(email: String!): LoginResponse!
    }

    type Deanery {
        id: ID!
        name: String!
        shortName: String
        diocese: Diocese!
    }
    type Diocese {
        id: ID!
        name: String!
        shortName: String
        deaneries: [Deanery]
    }
    type User {
        id: ID!
        email: String!
        name: String
        password: String
        # postersCreate:[Poster]
        # postersUpdate:[Poster]
    }
    type LoginResponse {
        token: String
        user: User
    }
    # type Poster {
    #     id: ID!
    #     name: String!
    #     title: String
    #     image: String
    #     thumbnail: String
    #     description: String
    #     published: Boolean!
    #     authorCreate: User
    #     authorUpdate: User
    # }
  
`;
module.exports = typeDefs;