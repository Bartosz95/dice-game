"use strict";
import 'dotenv/config';
import express  from 'express'
const session = require('express-session');
const Keycloak = require('keycloak-connect');
import cors from 'cors'

import logger from './libs/logger';
import gameRouter from './routers/gameRouter';
import checkHeader from './libs/checkHeader';

const NODE_ENV = process.env.NODE_ENV;
const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;
const URL = process.env.APP_URL;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

if(NODE_ENV === undefined) {
  throw new Error('env NODE_ENV is undefined');
}
if(HOST === undefined) {
  throw new Error('env APP_HOST is undefined');
}
if(PORT === undefined) {
  throw new Error('env APP_PORT is undefined');
}
if(URL === undefined) {
  throw new Error('env APP_URL is undefined');
}
if(CORS_ORIGIN === undefined) {
  throw new Error('env CORS_ORIGIN is undefined');
}



const app = express();
app.set( 'trust proxy', true );
app.use(cors({}))
app.use(checkHeader)
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(URL, gameRouter);

app.use((req, res) => {
  logger.info(`Request ${req.method} ${req.path} not found. Redirect to ${URL}`)
  res.redirect(307, `${URL}/`)
})

const service = app.listen(PORT, HOST, () => logger.info(`Running on http://${HOST}:${service.address().port}${URL}`));

export default service
