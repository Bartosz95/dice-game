"use strict";
import 'dotenv/config';
import express  from 'express'

import logger from './libs/logger';
import db from './libs/dbGameWrapper'

<<<<<<< HEAD
import gameRouter from './routers/gameRouter';
=======
import createGameRouter from './routers/gameRouter';
>>>>>>> 08cce62 (Import db to router as param)
import jwtCheck from './libs/jwtCheck'

const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;
const URL = process.env.APP_URL;
const NODE_ENV = process.env.NODE_ENV
const app = express();

//if (NODE_ENV === "production") {
  //app.use(jwtCheck);
//}



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

<<<<<<< HEAD
const game = gameRouter(db)
app.use(URL, game);
=======
app.use(URL, createGameRouter(db));
>>>>>>> 08cce62 (Import db to router as param)

app.use((req, res) => {
  logger.info(`Request ${req.method} ${req.path} not found. Redirect to ${URL}`)
  res.redirect(307, `${URL}/`)
})

app.listen(PORT, HOST, () => logger.info(`Running on http://${HOST}:${PORT}${URL}`));
