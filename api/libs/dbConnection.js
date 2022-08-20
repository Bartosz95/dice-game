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

let DB_URL = null;

switch (NODE_ENV) {
    case 'test':
        DB_URL = `mongodb://${HOST}:${PORT}/test`
        break;
    case 'production':
        DB_URL = `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/`
        break;
    default:
        DB_URL = `mongodb+srv://${USER}:${PASSWORD}@${HOST}`
}

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