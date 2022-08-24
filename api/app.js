"use strict";
import 'dotenv/config';
import express  from 'express'
import session from 'express-session'
import Keycloak from 'keycloak-connect'
import cors from 'cors'


import logger from './libs/logger';
import gameRouter from './routers/gameRouter';
import checkHeader from './libs/checkHeader';
import decodeToken from './libs/decodeToken'

const NODE_ENV = process.env.NODE_ENV;
const PREFIX = process.env.PREFIX || '/'

logger.info(`Endpoints avaiable on ${PREFIX}`)

if(NODE_ENV === undefined) {
  throw new Error('env NODE_ENV is undefined');
}
logger.info(`App runung in ${NODE_ENV} mode.`)

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

const app = express();
app.set('trust proxy', true );
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(checkHeader)

if(NODE_ENV !== 'test'){
  app.use(keycloak.middleware());
  app.use(decodeToken)
  app.use('/', keycloak.protect('user'), gameRouter);
} else {
  app.use(decodeToken)
  app.use('/', gameRouter);
}

app.use((req, res) => {
  logger.info(`Request ${req.method} ${req.path} not found. Redirect to ${PREFIX}`)
  res.redirect(307, `${PREFIX}/`)
})

export default app
