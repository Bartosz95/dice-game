import mongoose from 'mongoose'

import logger from './logger';
import gameSchema from './db_schemas/Game'

const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;


const URI = `mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/`;

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;

connection.once("open", () => logger.info("Database connection established successfully"));

exports.gameModel = mongoose.model("game", gameSchema);