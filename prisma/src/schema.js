// const { gql } = require('apollo-server');
const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
    type Query {
        deaneries:[Deanery!]!
        deanery(id: ID!): Deanery
        dioceses:[Diocese!]!
        diocese(id: ID!): Diocese
        currentUser: User!
        users: [User!]!
    }

    type Mutation {
        createDeanery(name: String!, shortName: String, published: Boolean, dioceseId: ID!): Deanery
        updateDeanery(id: ID!, name: String!, shortName: String,published: Boolean, dioceseId: ID!): Deanery
        deleteDeaneries(ids: [ID!]): deleteDeaneriesResponse
        createDiocese(name: String!, shortName: String, published: Boolean): Diocese
        updateDiocese(id: ID!, name: String!, shortName: String, published: Boolean): Diocese
        deleteDioceses(ids: [ID!],): deleteDiocesesResponse
        signUp(email: String!, password: String!): User!
        signIn(email: String!, password: String!): LoginResponse!
    }

    type Diocese {
        id: ID!
        name: String!
        shortName: String
        published: Boolean
        deaneries: [Deanery!]!
    }
    type Deanery {
        id: ID!
        name: String!
        shortName: String
        published: Boolean
        diocese: Diocese
        parishes: [Parish!]!
    }
    type Parish {
        id: ID!
        name: String!
        shortName: String
        published: Boolean
        deanery: Deanery
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

    type deleteDeaneriesResponse {
        count: Int
    }

    type deleteDiocesesResponse {
        count: Int
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