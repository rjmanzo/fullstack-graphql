const gql = require('graphql-tag')
const { ApolloServer } = require('apollo-server')

const typeDefs = gql`

    enum ShoeType {
        ADIDAS
        NIKE
        PUMA
    }

    type User {
        email: String!
        avatar: String
        friends: [User]!
    }

    interface Shoe {
        brand: ShoeType!
        size: Int
    }

    # When two absctration has any relationship use Interface if not use UNION
    union Footerwear = Sneaker | Boot # Just an example (on this case the objects has relationship)

    type Sneaker implements Shoe {
        brand: ShoeType!
        size: Int!
        sport: String
    }

    type Boot implements Shoe {
        brand: ShoeType!
        size: Int!
        hasGrip: Boolean
    }

    input ShoesInputs {
        brand: ShoeType!
        size: Int
    }

    type Query {
        me: User!
        shoes(input: ShoesInputs): [Shoe]
    }

    input newShoeInput {
        brand: ShoeType!
        size: Int!
    } 

    type Mutation {
        newShoe(input: newShoeInput!): Shoe!
    }
`

const resolvers = {
    Query: {

        shoes(_, {input}) {
            return [
                {brand: 'NIKE', size: 14, sport: 'basketball'},
                {brand: 'ADIDAS', size: 11, hasGrip: true}
            ]
            // .filter(shoe => shoe.brand === input.brand)
        },
        me() {
            return {
                email: 'yoda@masters.com',
                avatar: 'http://yoda.png',
                friends: []
            }
        }
    },
    Mutation: {
        newShoe(_, {input}) {
            return input
        }
    },
    Shoe: {
        __resolveType(shoe) {
            if(shoe.sport) return 'Sneaker'
            return 'Boot'
        }
    }
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
})


apolloServer.listen(4000).then(() => console.log('listen on port 4000'))