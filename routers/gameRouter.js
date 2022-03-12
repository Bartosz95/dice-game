import { Router } from 'express'

import logger from '../libs/logger';
import Game from '../libs/game_modules/Game'
import gameModel from '../libs/db_schemas/GameSchema'
import Mug from '../libs/game_modules/Mug';

// create a game if it not exist
gameModel.find({}, (err, docs) => {
    if(err) {
      logger.error(err)
    } else if(docs.length < 1) {
        const instance = new gameModel({game: new Game(5,6)})
        instance.save((err) => {
            if(err) {
                logger.error(err)
            } else {
                logger.info(`Created game ${instance._id}`)
            }
        });
    }
  });

/*
First add token to token enviroment variable
token=$(curl --request POST --url https://dev-8ti8osnq.us.auth0.com/oauth/token -H 'content-type: application/json' \
-d '{"client_id":"zMyBsd3sTTrd19xnWLIq3kdd5oqePtUH","client_secret":"h4U5_7zrv1DNu51tUgHHFXmBQtAIYPkyFDxYIfuZzdlD3hBV7n5-pujCwmobvJuC","audience":"https://dicegame/api","grant_type":"client_credentials"}' | jq '.access_token')

echo $token
*/

const router = Router();

// get all games
// curl -H 'authorization: Bearer $token' http://localhost:3000/api/v1/game
router.get('/game/', (req, res) => {
    gameModel.find({}, (err, docs) => {
        if(err) {
          logger.error(err)
          res.send("Some problem occurence");
        }
        res.send(docs);
      });
});

// get specific game
// curl -H 'authorization: Bearer $token' http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef
router.get('/game/:id', (req, res) => {
    const id = req.params.id;
    gameModel.findOne({ _id: id}, (err, docs) => {
        if(err) {
          logger.error(err)
          res.send("Some problem occurence");
        }
        res.send(docs);
    });
});

// create a game
// curl -d '{"numberOfDices":5, "numberOfDicesides": 6}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/game 
router.post('/game/', (req, res) => {
    const numberOfDices = req.body.numberOfDices;
    const numberOfDicesides = req.body.numberOfDicesides;
    const instance = new gameModel({game: new Game(numberOfDices, numberOfDicesides)});
    instance.save((err) => {
            if(err) {
                logger.error(err)
            } else {
                logger.info(`Created game ${instance._id}`)
                res.send(instance);
            }
        });
});

// roll the dices
// curl -d '{"numbersToChange":[1,2]}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
router.post('/game/:id', (req, res) => {
    const numbersToChange = req.body.numbersToChange;

    gameModel.findOne({ _id: req.params.id}, (err, docs) => {
        if(err) {
          logger.error(err)
          res.send("Some problem occurence");
        }
        const mug = new Mug(docs.game.mug.dices)
        mug.rollTheDices(numbersToChange)
        gameModel.replaceOne(docs, {game: {mug : mug}}, (err, message) => {
            if(err) {
                logger.error(err);
                res.send("Some problem occurence");
            } else {
                logger.info(`Updated game ${docs._id}`)
                res.send(docs);
            }
        })
    });
});




export default router;