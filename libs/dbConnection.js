import mongoose from 'mongoose'

import logger from './logger';

const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const NODE_ENV = process.env.NODE_ENV;

const DB_URL = NODE_ENV === 'development' ?  `mongodb://${HOST}:${PORT}/` : `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/`

async function connectToMongo() {
    try {
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoose.connection.once('open', () => logger.info("Database connection established successfully"));
        mongoose.connection.on('error', error => logger.error(error));
    } catch (error) {
        logger.error(error);
    }
}

connectToMongo()
exports.mongoose = mongoose
exports.mongoUrl = DB_URL