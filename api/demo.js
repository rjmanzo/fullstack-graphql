const gql = require('graphql-tag')
const { ApolloServer } = require('apollo-server')

const typeDefs = gql`
    type User {
        email: String!
        avatar: String
        friends: [User]!
    }

    type Shoe {
        brand: String
        size: Number
    }

    input ShoesInputs {
        brand: String
        size: Number
    }

    type Query {
        me: User!
        shoes(input: ShoesInputs): [Shoe]
    }
`

const resolvers = {
    Query: {

        shoes(_, {input}) {
            return [
                {brand: 'Nike', size: 14},
                {brand: 'Adidas', size: 11}
            ].filter(shoe => shoe.brand === input.brand)
        },

        me() {
            return {
                email: 'yoda@masters.com',
                avatar: 'http://yoda.png',
                friends: []
            }
        }
    }
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
})


apolloServer.listen(4000).then(() => console.log('listen on port 4000'))