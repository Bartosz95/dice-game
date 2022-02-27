import { Router } from 'express'
import { mongoose } from 'mongoose';

import Game from '../game_modules/Game'
import db from '../libs/db'


const game = new Game(5,6);


const router = Router();

router.get('/', (req, res, next) => {
    res.send(game);
});

// curl -d '{"numbersToChange":[1,2]}' -H "Content-Type: application/json" http://localhost:3000/api/v1/game
router.post('/', (req, res, next) => {
    const numbersToChange = req.body.numbersToChange;
    game.mug.rollTheDices(numbersToChange);
    res.send(game);
});

export default router;