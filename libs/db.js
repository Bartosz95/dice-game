import mongoose from 'mongoose'

import logger from './logger';

const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const NODE_ENV = process.env.NODE_ENV;

let DB_URL = null
if(NODE_ENV === 'development'){
    DB_URL = `mongodb://${HOST}:${PORT}/`;
}else {
    DB_URL = `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/`;
}

mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;

connection.once("open", () => logger.info("Database connection established successfully"));

exports.mongoose = mongoose
exports.mongoUrl = DB_URL