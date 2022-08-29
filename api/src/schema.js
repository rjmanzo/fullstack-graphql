const { gql } = require('apollo-server')

/**
 * Type Definitions for our Schema using the SDL.
 */
const typeDefs = gql`
    type User {
        id: ID!
        username: String!
    }

    type Pet {
        id: ID!
        createdAt: String!
        name: String!
        type: String!
    }

    # Input fields to use on Filter
    input PetInput {
        name: String
        type: String
    } 

    type Query {
        #(inputs: filters)
        pets(input: PetInput): [Pet]!
        pet(input: PetInput): [Pet]
    }  
`;

module.exports = typeDefs
