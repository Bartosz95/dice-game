import { Router } from 'express'

import logger from '../libs/logger';
import Game from '../libs/game_modules/Game'
import gameModel from '../libs/db_schemas/GameSchema'
import Mug from '../libs/game_modules/Mug';

const errorMessage = "Some problem occurence"

// create a game if it not exist
//gameModel.deleteMany({__v: 0}, function (err) {})
gameModel.find((err, docs) => {
    if(err) {
      logger.error(err)
      console.log(err);
    }

    console.log(docs);
})

// gameModel.find({}, (err, docs) => {
//     if(err) {
//       logger.error(err)
//     } else if(docs.length < 1) {
//         const instance = new gameModel({game: new Game(5,6)})
//         instance.save((err) => {
//             if(err) {
//                 logger.error(err)
//             } else {
//                 logger.info(`Created game ${instance._id}`)
//             }
//         });
//     }
//   });

/*
First add token to token enviroment variable
token=$(curl --request POST --url https://dev-8ti8osnq.us.auth0.com/oauth/token -H 'content-type: application/json' \
-d '{"client_id":"5AXHpewP0yBnJAya4yb2BUGf2abJCbQ8","client_secret":"6r7KiwsTG5YjYLOy8UIUeTHcKT3Et36SK4Vq4vL7SKo2rzz__xp7xRT9yshJqKVf","audience":"https://dicegame/api","grant_type":"client_credentials"}' | jq '.access_token')

echo $token
*/

const router = Router();


// get all games
// curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game
router.get('/game', (req, res) => {
    gameModel.find({'game.userIDs': { $in: [req.body.userID]}} , (err, docs) => {
        if(err) {
          logger.error(err)
          res.send(errorMessage);
        }
        res.send(docs);
      });
});

// get specific game
// curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
router.get('/game/:id', (req, res) => {
    const id = req.params.id;
    gameModel.findOne({ _id: id, 'game.userIDs': { $in: [req.body.userID]}}, (err, docs) => {
        if(err) {
          logger.error(err)
          res.send(errorMessage);
        }
        res.send(docs);
    });
});


// create a game
// curl -d '{"numberOfDices":5, "numberOfDiceSides": 6, "userID":"6224b5c30eac08007061fa31", "userIDs":["1", "2"]}' -H "authorization: Bearer $token" -H "Content-Type: application/json" http://localhost:3000/api/v1/game 
router.post('/game', (req, res) => {
    const numberOfDices = req.body.numberOfDices;
    const numberOfDiceSides = req.body.numberOfDiceSides;
    const userIDs = req.body.userIDs.includes(req.body.userID) ? req.body.userIDs : req.body.userIDs.concat(req.body.userID);
    const game = new Game(numberOfDices, numberOfDiceSides, userIDs)
    console.log(game)
    const instance = new gameModel({game});
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
    const id = req.params.id;
    const numbersToChange = req.body.numbersToChange;
    const userID = req.body.userID;
    const response = {
        status: null,
        message: null,
        object: null

    }
    gameModel.findOne({ _id: id, 'game.userIDs': { $in: [userID] }}, (err, doc) => {
        if(err) {
          logger.error(err)
          res.send(errorMessage);
        }
        const isActive = doc.game.isActive;
        const numberOfTurn = doc.game.numberOfTurn;
        const currentUser = doc.game.currentUser;
        const currentRoll = doc.game.currentRoll;
        const userIDs = doc.game.userIDs;
        const mug = new Mug(doc.game.mug.dices);
        const replacement = {game: doc.game};

        if(!isActive){
            response.message="Game is over"
        }
         else if (currentUser !== userID) {
            res.end("Is not user's turn")
        }

        if(currentRoll === 2) {
            const userIndex = userIDs.indexOf(currentUser)
            if(userIndex ===  userIDs.length -1 ) {
                replacement.game.numberOfTurn = numberOfTurn + 1
                if(numberOfTurn === 12) {
                    logger.info(`Ended game: ${id}`)
                    replacement.game.isActive = false
                }
            }
            replacement.game.currentUser = userIDs[(userIndex + 1) % userIDs.length]
            
        }
        replacement.game.currentRoll = (currentRoll + 1) % 3
        
        mug.rollTheDices(numbersToChange)
        replacement.game.mug = mug

        gameModel.findByIdAndUpdate(id, replacement , (err, message) => {
            if(err) {
                logger.error(err);
                res.send(errorMessage);
            } else {
                logger.info(`Updated game: ${id}`)
                res.send(doc);
            }
        })
        //
    });

    //res.send(response)
});

export default router;