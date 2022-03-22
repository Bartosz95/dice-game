import { Router } from 'express'

import logger from '../libs/logger';
import { Game, rollTheDices} from '../libs/game_modules/Game'
import gameModel from '../libs/db_schemas/GameSchema'
//import Mug from '../libs/game_modules/Mug';

const errorMessage = "Some problem occurence"

// create a game if it not exist
//gameModel.deleteMany({__v: 0}, function (err) {})
gameModel.find((err, docs) => {
    if(err) {
      logger.error(err)
      console.log(err);
    }

    console.log(docs.length);
})

/*
First add token to token enviroment variable
token=$(curl --request POST --url https://dev-8ti8osnq.us.auth0.com/oauth/token -H 'content-type: application/json' \
-d '{"client_id":"5AXHpewP0yBnJAya4yb2BUGf2abJCbQ8","client_secret":"6r7KiwsTG5YjYLOy8UIUeTHcKT3Et36SK4Vq4vL7SKo2rzz__xp7xRT9yshJqKVf","audience":"https://dicegame/api","grant_type":"client_credentials"}' | jq '.access_token')

echo $token
*/

const router = Router();

// get all games
// curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game
router.get('/user/:userID/game', (req, res) => {
    const userID = req.params.userID;

    const userIDstring = `game.users.${userID}`;
    gameModel.find({userIDstring : { $exists: true}} , (err, docs) => {
        if(err) {
          logger.error(err)
          res.send(errorMessage);
        }
        res.send(docs);
      });
});

// get specific game
// curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
router.get('/user/:userID/game/:gameID', (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;

    const userIDstring = `game.users.${userID}`;
    gameModel.findOne({ _id: gameID, userIDstring : { $exists: true}}, (err, docs) => {
        if(err) {
          logger.error(err)
          res.send(errorMessage);
        }
        res.send(docs);
    });
});

// create a game
// curl --url http://localhost:3000/api/v1/user/1/game/623a2a1bab1114ac2afabd9c -d '{"numberOfDices":5, "numberOfDiceSides": 6, "userIDs":["1", "2"]}' -H "Content-Type: application/json" -H "authorization: Bearer $token" 
router.post('/user/:userID/game', (req, res) => {
    const userID = req.params.userID;
    let userIDs = req.body.userIDs;

    userIDs = userIDs.includes(userID) ? userIDs : userIDs.concat(userID); // add user to game if is not added in list
    const game = new Game(userIDs)
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
router.post('/user/:userID/game/:gameID', (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    const numbersToChange = req.body.numbersToChange;
    const chosenFigure = req.body.chosenFigure;
    
    const userIDstring = `game.users.${userID}`;
    gameModel.findOne({ _id: gameID, userIDstring : { $exists: true}}, (err, doc) => {
        if(err) {
          logger.error(err)
          res.send(errorMessage);
        }
        const isActive = doc.game.isActive;
        const numberOfTurn = doc.game.numberOfTurn;
        const currentUser = doc.game.currentUser;
        const currentRoll = doc.game.currentRoll;
        const mug = doc.game.users[userID].mug;
        const table = doc.game.users[userID].table
        //const replacement = {game: doc.game};
        
        if(!isActive){
            res.send("Game is over")
            return
        }
        if (currentUser !== userID) {
            res.send("Is not user's turn")
            return
        }

        if(currentRoll === 0){
            rollTheDices(mug, [0,1,2,3,4])
        }
        else if(chosenFigure){
            if(table.hasOwnProperty(chosenFigure) && table[chosenFigure] === null) {
                table[chosenFigure] = Object.values(mug)
            }
        }
        else if(numbersToChange) {
            rollTheDices(mug, numbersToChange)
        }

        

    //     if(currentRoll > 2) {
    //         const userIndex = userIDs.indexOf(currentUser)
    //         if(userIndex ===  userIDs.length -1 ) {
    //             replacement.game.numberOfTurn = numberOfTurn + 1
    //             if(numberOfTurn === 12) {
    //                 logger.info(`Ended game: ${id}`)
    //                 replacement.game.isActive = false
    //             }
    //         }
    //         replacement.game.currentUser = userIDs[(userIndex + 1) % userIDs.length]
            
    //     }
    //     replacement.game.currentRoll = (currentRoll + 1) % 4
        
 

    //     gameModel.findByIdAndUpdate(id, replacement , (err, message) => {
    //         if(err) {
    //             logger.error(err);
    //             res.send(errorMessage);
    //             return
    //         } else {
    //             logger.info(`Updated game: ${id}`)
    //             res.send(doc);
    //         }
    //     })
    console.log(mug)
    console.log(table)
    res.send(doc)
    });
});

export default router;