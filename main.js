// const logger = require('./logger');
const express = require('express');
const bodyParser = require('body-parser');
const Game = require('./game_modules/Game.js')


const game = new Game(5,6);

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json());

app.get('/api/v1/game', (req, res, next) => {
    res.send(game);
});

// curl -d '{"numbersToChange":[1,2]}' -H "Content-Type: application/json" http://localhost:3000/api/v1/game
app.post('/api/v1/game', (req, res, next) => {
    const numbersToChange = req.body.numbersToChange;
    game.mug.rollTheDices(numbersToChange);
    res.send(game);
});


app.listen(3000, () => {
    console.log('Listenin')
});