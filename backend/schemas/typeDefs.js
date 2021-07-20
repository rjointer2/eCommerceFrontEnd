
// grab the module to create type definitions
const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type User {
        _id: ID!
        name: String!
        email: String!
        username: String!
        password: String!
        cart: [Product]
        products: [Product]
        isVendor: Boolean!
    }

    type Product {
        name: String!
        price: String!
        department: String!
        summary: String!
        image: String!
        createdBy: String!

    }

    type Query {
        users: [User]
    }

    type Mutation {
        addProduct( name: String!, price: String!, department: String!, summary: String!, createdBy: String!, image: String! ): Product
        addUser( email: String!, password: String!, username: String!, cart: String!, products: String!, isVendor: Boolean! ): User 
    }

`;

module.exports = typeDefs;