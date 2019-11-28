// const { gql } = require('apollo-server');
const { gql } = require('apollo-server-lambda');
const GraphQLJSON = require('graphql-type-json');

const typeDefs = gql`
    scalar JSON
    type Query {
        dioceses:[Diocese!]!
        diocese(id: ID!): Diocese
        deaneries:[Deanery!]!
        deanery(id: ID!): Deanery
        deaneriesByDiocese(dioceseId: ID!): Diocese
        parishes:[Parish!]!
        parish(id: ID!): Parish
        parishesByDeanery(deaneryId: ID!): Deanery
        categories:[Category!]!
        category(id: ID!): Category
        posters:[Poster!]!
        poster(id: ID!): Poster
        currentUser: User!
        users: [User!]!
    }

    type Mutation {
        createDiocese(input: DioceseInput): Diocese!
        updateDiocese(id: ID!, input: DioceseInput): Diocese!
        deleteDioceses(ids: [ID!]!,): deleteDiocesesResponse!
        createDeanery(input: DeaneryInput): Deanery!
        updateDeanery(id: ID!, input: DeaneryInput): Deanery!
        deleteDeaneries(ids: [ID!]!): deleteDeaneriesResponse!
        createParish(input: ParishInput): Parish!
        updateParish(id: ID!, input: ParishInput): Parish!
        deleteParishes(ids: [ID!]!): deleteParishesResponse!
        createCategory(input: CategoryInput): Category!
        updateCategory(id: ID!, input: CategoryInput): Category!
        deleteCategories(ids: [ID!]!): deleteCategoriesResponse!
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
    type Category {
        id: ID!
        name: String!
        title: String
        content: String
        published: Boolean
        diocese: Diocese
        deanery: Deanery
        parish: Parish
        posters: [Poster!]!
    }
    type Poster {
        id: ID!
        name: String!
        image: String
        thumbnail: String
        secure_url: String
        public_id: String
        published: Boolean
        category: Category
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
    type deleteCategoriesResponse {
        count: Int
    }
    type CategoryResponse {
        category: Category
        posters: [Poster!]!
    }

    input ImageInput {
        public_id: String
        secure_url: String
    }
  
    input DioceseInput {
        name: String
        shortName: String
        published: Boolean
    }

    input DeaneryInput {
        name: String
        shortName: String
        published: Boolean
        dioceseId: ID!
    }

    input ParishInput {
        name: String
        shortName: String
        published: Boolean
        deaneryId: ID!
        dioceseId: ID!
    }

    input CategoryInput {
        name: String!
        title: String
        content: String
        published: Boolean
        dioceseId: ID!
        deaneryId: ID!
        parishId: ID!
        images:[ImageInput]
    }
`;
module.exports = typeDefs;