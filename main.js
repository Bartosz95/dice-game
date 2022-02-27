"use strict";
import 'dotenv/config';
import express  from 'express'

import logger from './libs/logger';
import game from './routers/game';

const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;
const URL = process.env.APP_URL;


const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());

app.use(URL, game);

app.listen(PORT, HOST, () => logger.info(`Running on http://${HOST}:${PORT}${URL}`));
