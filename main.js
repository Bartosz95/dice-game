"use strict";
import 'dotenv/config';
import express  from 'express'
import expressSession from 'express-session'

import logger from './libs/logger';
import game from './routers/gameRouter';
import authRouter from './routers/auth'
import { passport, session } from './libs/auth'

const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;
const URL = process.env.APP_URL;

const AUTH_URL = '/'

// if (app.get("env") === "production") {
//   // Serve secure cookies, requires HTTPS
//   session.cookie.secure = true;
// }

const app = express();
app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());

app.use(AUTH_URL, authRouter);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  console.log(req.isAuthenticated())
  if (!req.isAuthenticated()) {
    logger.info(`User doesn't logged. Redirect to ${AUTH_URL}login`)
    res.redirect(`${AUTH_URL}login`)
  } else {
    next();
  }
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.json());
app.use(URL, game);

app.use((req, res) => {
  logger.info(`Request ${req.method} ${req.path} not found. Redirect to ${URL}`)
  res.redirect(URL)
})

app.listen(PORT, HOST, () => logger.info(`Running on http://${HOST}:${PORT}${URL}`));
