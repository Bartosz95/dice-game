"use strict";
import 'dotenv/config';
import express  from 'express'

import logger from './libs/logger';
import gameRouter from './routers/gameRouter';
import jwtCheck from './libs/jwtCheck'

const NODE_ENV = process.env.NODE_ENV;
const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;
const URL = process.env.APP_URL;

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


const app = express();

try {
  if (NODE_ENV === "production") {
    app.use(jwtCheck);
  }
} catch (err) {
  app.use((req,res) =>{
    res.send({'message': err.message})
  }) 
}


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(URL, gameRouter);

app.use((req, res) => {
  logger.info(`Request ${req.method} ${req.path} not found. Redirect to ${URL}`)
  res.redirect(307, `${URL}/`)
})

app.listen(PORT, HOST, () => logger.info(`Running on http://${HOST}:${PORT}${URL}`));

export default app
