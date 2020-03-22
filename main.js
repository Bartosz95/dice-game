// const logger = require('./logger');
const express = require('express');
const Game = require('./game_modules/Game.js')

const game1 = new Game(5,6); 
const app = express();

app.get('/', (req, res, next) => {
    res.send(game1);
});

app.listen(8080, () => {
    console.log('Listenin')
});