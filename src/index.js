import { GraphQLServer, PubSub } from 'graphql-yoga'

import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutations'
import Subscription from './resolvers/Subscription'
import db from './db'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Post,
        User,
        Comment
    },
    context: {
        db,
        pubsub
    }
})

server.start(() => {
    console.log('Server is up')
})