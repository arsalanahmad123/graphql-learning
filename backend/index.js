import express from 'express';
import http from 'http';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './db/connectDB.js';

import passport from 'passport';
import session from 'express-session';
import connectMongo from "connect-mongodb-session"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildContext } from 'graphql-passport';
import {configurePassport} from "./passport/passport.config.js"

import mergedResolvers from './resolvers/index.js';
import mergedTypeDefs from './typeDefs/index.js';
import path from 'path';

// Load environment variables from .env file
configDotenv();
configurePassport();

const app = express();

// Create an HTTP server using the Express app
const httpServer = http.createServer(app);

// Create a MongoDB session store
const MongoDBStore = connectMongo(session);

// Configure the session store with MongoDB URI and collection name
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
});

// Catch and log errors from the session store
store.on('error', (error) => console.error(error));

// Configure the Express app to use sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie:{
            maxAge: 1000 * 60 * 60 * 24 * 7,// 1 week
            httpOnly: true,
        },
        store
    })
);

// Initialize Passport and configure it to use sessions
app.use(passport.initialize());
app.use(passport.session());

// Create a new ApolloServer instance with type definitions, resolvers, and plugins
const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start the ApolloServer
await server.start();

// Apply middleware to the Express app
app.use(
    '/graphql',
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res }), 
    })
);

app.use(express.static(path.join(path.resolve(), 'frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'frontend/dist/index.html'));
});

// Start the HTTP server and listen on port 4000
await new Promise((resolve) => {
    httpServer.listen({ port: 4000 }, resolve);
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});

// Connect to the MongoDB database
await connectDB();
