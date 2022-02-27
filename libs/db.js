import mongoose from 'mongoose'

import logger from './logger';


const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;


const URI = `mongodb://${HOST}:${PORT}/games`;
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
connection.once("open", () => logger.info("Database connection established successfully"));
db.on('error', logger.error);

const Schema = mongoose.Schema;

let game = new Schema(
  {
    id: {
      type: String
    },
    mug: {
      type: Object
    },
  },
  { collection: "games" }
);

module.exports = mongoose.model("games", game);