import 'dotenv/config';
import logger from './logger';

import express  from 'express'
import bodyParser from 'body-parser'
import Game from './game_modules/Game'

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const URL = process.env.URL;

const game = new Game(5,6);
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json());

app.get(URL, (req, res, next) => {
    res.send(game);
});

// curl -d '{"numbersToChange":[1,2]}' -H "Content-Type: application/json" http://localhost:3000/api/v1/game
app.post(URL, (req, res, next) => {
    const numbersToChange = req.body.numbersToChange;
    game.mug.rollTheDices(numbersToChange);
    res.send(game);
});

app.listen(PORT, HOST, () => logger.info(`Running on http://${HOST}:${PORT}${URL}`));
