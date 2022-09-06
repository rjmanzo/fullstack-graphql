import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import gql from 'graphql-tag'

/**
 * Create a new apollo client and export as default
 */

const typeDefs = gql`
    extend type User {
        age: Int
    }
    
    extend type Pet {
        vaccinated: boolean
    }
`

const resolvers = {
    User: {
        age() {
            return 35
        }
    },
    Pet: {
        vaccinated() {
            return true
        }
    }

}

const httpLink = new HttpLink({ uri: 'http://localhost:4000/' })
const cache = new InMemoryCache()

const delay = setContext(
    request =>
        new Promise((success, fail) => {
            setTimeout(() => {
                success()
            }, 800)
        })
)

const link = ApolloLink.from([
    delay,
    httpLink
])

const client = new ApolloClient({
    link,
    cache,
    typeDefs,
    resolvers
})

export default client

