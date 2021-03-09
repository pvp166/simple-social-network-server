const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/TypeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGOOSEDB } = require('./config');

const pubsub = new PubSub();
const PORT = process.env.PORT || 5000;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({ req }) => ({ req, pubsub })
});

mongoose
    .connect(MONGOOSEDB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: PORT });
    })
    .then(
        res => {
            console.log(`Server running at ${res.url}`)
        })
    .catch(err => {
        console.error(err);
    });

