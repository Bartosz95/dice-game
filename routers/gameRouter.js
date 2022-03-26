import { Router } from 'express'
import logger from '../libs/logger';
import { Game, makeMove } from '../libs/Game'
import { getAllGames, getParticularGame, createGame, updateGame, deleteAllGames, deleteParticularGames } from '../libs/GameSchema'

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
    getAllGames(userID, (errorMessage, games) => {
        if(errorMessage) {
            res.send(errorMessage);
        }
        res.send(games);
    })
});

// get specific game
// curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
router.get('/user/:userID/game/:gameID', (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    getParticularGame(userID, gameID, (errorMessage, game) => {
        if(errorMessage) {
            return res.send(errorMessage);
        }
        res.send(game);
    })
});

// create a game
// curl --url http://localhost:3000/api/v1/user/1/game/623a2a1bab1114ac2afabd9c -d '{"numberOfDices":5, "numberOfDiceSides": 6, "userIDs":["1", "2"]}' -H "Content-Type: application/json" -H "authorization: Bearer $token" 
router.post('/user/:userID/game', (req, res) => {
    const userID = req.params.userID; 
    let userIDs = req.body.userIDs;
    userIDs = userIDs.includes(userID) ? userIDs : userIDs.concat(userID); // add user to game if is not added in list
    const game = new Game(userIDs)
    createGame(game, (errorMessage, game) => {
        if(errorMessage) {
            return res.send(errorMessage);
        }
        res.send(game);
    })
});


// roll the dices
// curl -d '{"numbersToChange":[1,2]}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
router.post('/user/:userID/game/:gameID', (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    const numbersToChange = req.body.numbersToChange;
    const chosenFigure = req.body.chosenFigure;
    getParticularGame(userID, gameID, (errorMessage, doc) => {
        if(errorMessage) {
            logger.error(errorMessage)
            res.send(errorMessage);
        }
        const game = doc.game;
        makeMove(game, userID, numbersToChange, chosenFigure, (errorMessage, game) => {
            if(errorMessage || (game === 'null') ) {
                logger.error(`Player ${userID} in game ${gameID} has error message: ${errorMessage}`)
                res.send(errorMessage)
            }
            updateGame(gameID, game, (errorMessage) => {
                if(errorMessage) {
                    logger.error(errorMessage);
                } else {
                    logger.info(`Player ${userID} make a move in game: ${gameID}`)
                }
                res.send(errorMessage || doc);
            })
        })
    })
})

router.delete('/user/:userID/game', (req, res) => {
    const userID = req.params.userID;
    deleteAllGames(userID, (errorMessage) => {
        res.send(errorMessage || `Delete all games for user ${userID}`)
    })
});

router.delete('/user/:userID/game/:gameID', (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    deleteParticularGames(userID, gameID, (errorMessage) => {
        res.send(errorMessage || `Delete ${gameID} games`);
    })
});


export default router;