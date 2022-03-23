import { Router } from 'express'

import logger from '../libs/logger';
import { Game, rollTheDices, saveFigure} from '../libs/game_modules/Game'
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
        const numberOfRoll = doc.game.numberOfRoll;
        const currentUser = doc.game.currentUser;
        const mug = doc.game.mug;
        const game = doc.game;

        if(!isActive){
            res.send("Game is over")
            return
        }
        if (userID !== currentUser) {
            res.send(`This is turn of user: ${currentUser}`)
            return
        }

        if(numberOfRoll === 0) {
            try {
                rollTheDices(game, [0,1,2,3,4])
            } catch (error) {
                logger.error(error)
                res.send("You cannot choose this dices")
                return
            }
        } 
        else if(chosenFigure) {
            try {
                saveFigure(game, chosenFigure)
            } catch (error) {
                logger.error(error)
                res.send("You cannot choose this figure")
                return
            }
        }
        else if (numberOfRoll < 3) {
            if (!numbersToChange){
                res.send("You have to choose dice to rool on choose a figure")
                return
            } else {
                try {
                    rollTheDices(game, numbersToChange)
                } catch (error) {
                    logger.error(error)
                    res.send("You cannot choose this dices")
                    return
                }
            }
        } 
        else {
            if(!chosenFigure) {
                res.send("You have to choose a figure")
                return
            } else {
                try {
                    saveFigure(game, chosenFigure)
                } catch (error) {
                    logger.error(error)
                    res.send("You cannot choose this figure")
                    return
                }   
            }
        }

        gameModel.findByIdAndUpdate(gameID, {game: game} , (err, message) => {
            if(err) {
                logger.error(err);
                res.send(errorMessage);
                return
            } else {
                logger.info(`User ${userID} updates game: ${gameID}`)
                res.send(doc);
                return
            }
        })
    });
});

router.delete('/user/:userID/game', (req, res) => {
    const userID = req.params.userID;

    const userIDstring = `game.users.${userID}`;
    gameModel.deleteMany({userIDstring : { $exists: true}}, (error) => {
        logger.error(error); 
    })
    res.send(`Delete all games for user ${userID}`);
});

router.delete('/user/:userID/game/:gameID', (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;

    const userIDstring = `game.users.${userID}`;
    const numberOfGames = gameModel.deleteOne({ _id: gameID, userIDstring : { $exists: true}}, (error) => {
        logger.error(error); 
    })
    res.send(`Delete ${numberOfGames} games`);
});


export default router;