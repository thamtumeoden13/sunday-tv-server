// const { gql } = require('apollo-server');
const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
    type Query {
        dioceses:[Diocese!]!
        diocese(id: ID!): Diocese
        deaneries:[Deanery!]!
        deanery(id: ID!): Deanery
        deaneriesByDiocese(dioceseId: ID!): Diocese
        parishes:[Parish!]!
        parish(id: ID!): Parish
        parishesByDeanery(deaneryId: ID!): Deanery
        currentUser: User!
        users: [User!]!
    }

    type Mutation {
        createDiocese(name: String!, shortName: String, published: Boolean): Diocese
        updateDiocese(id: ID!, name: String!, shortName: String, published: Boolean): Diocese
        deleteDioceses(ids: [ID!],): deleteDiocesesResponse
        createDeanery(name: String!, shortName: String, published: Boolean, dioceseId: ID!): Deanery
        updateDeanery(id: ID!, name: String!, shortName: String,published: Boolean, dioceseId: ID!): Deanery
        deleteDeaneries(ids: [ID!]): deleteDeaneriesResponse
        createParish(name: String!, shortName: String, published: Boolean,deaneryId: ID!, dioceseId: ID!): Deanery
        updateParish(id: ID!, name: String!, shortName: String, published: Boolean, deaneryId: ID!, dioceseId: ID!): Deanery
        deleteParishes(ids: [ID!]): deleteParishesResponse
        signUp(email: String!, password: String!): User!
        signIn(email: String!, password: String!): LoginResponse!
    }

    type Diocese {
        id: ID!
        name: String!
        shortName: String
        published: Boolean
        deaneries: [Deanery!]!
        parishes: [Parish!]!
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
        diocese: Diocese
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

    type deleteDiocesesResponse {
        count: Int
    }
    type deleteDeaneriesResponse {
        count: Int
    }
    type deleteParishesResponse {
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