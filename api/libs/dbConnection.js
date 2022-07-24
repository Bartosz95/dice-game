import mongoose from 'mongoose'

import logger from './logger';

const NODE_ENV = process.env.NODE_ENV;
const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;

if(NODE_ENV === undefined) {
    throw new Error('env NODE_ENV is undefined');
}
if(HOST === undefined) {
    throw new Error('env DB_HOST is undefined');
  }
if(PORT === undefined) {
  throw new Error('env DB_PORT is undefined');
}
if(USER === undefined && NODE_ENV === 'production') {
    throw new Error('env DB_USER is undefined');
}
if(PASSWORD === undefined && NODE_ENV === 'production') {
    throw new Error('env DB_PASSWORD is undefined');
}


const DB_URL =  NODE_ENV === 'development' ? `mongodb://${HOST}:${PORT}/dev` : 
                NODE_ENV === 'test' ? `mongodb://${HOST}:${PORT}/test` : `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/game`

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