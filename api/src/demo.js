const gql = require('graphql-tag')
const { ApolloServer } = require('apollo-server')

const typeDefs = gql`
    type User {
        email: String!
        avatar: String
        friends: [User]!
    }

    type Query {
        me: User!
    }
`

const resolvers = {
    Query: {
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