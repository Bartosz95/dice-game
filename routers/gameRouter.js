import { Router } from 'express'

import logger from '../libs/logger';
import Game from '../libs/game_modules/Game'
import { gameModel } from '../libs/db'

const NODE_ENV = process.env.NODE_ENV;

const game = new Game(5,6);


if(NODE_ENV === 'production'){
    const instance = new gameModel({game: game})
    instance.save((err) => {
        if(err) {
            logger.error(err)
        } else {
            logger.info("Save succes")
        }
    });
}


const router = Router();

router.get('/', (req, res, next) => {
    gameModel.find({}, (err, docs) => {
        if(err) {
          logger.error(err)
          res.send("Some problem occurence");
        }
        res.send(docs);
      });
    //res.send(game)
});

// curl -d '{"numbersToChange":[1,2]}' -H "Content-Type: application/json" http://localhost:3000/api/v1/game
router.post('/', (req, res) => {
    const numbersToChange = req.body.numbersToChange;
    game.mug.rollTheDices(numbersToChange);
    res.send(game);
});

export default router;