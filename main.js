// const logger = require('./logger');
const express = require('express');
const bodyParser = require('body-parser');
const Game = require('./game_modules/Game.js')


const game = new Game(5,6);

const app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
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