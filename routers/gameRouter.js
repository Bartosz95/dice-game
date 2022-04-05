import { Router } from 'express'
import logger from '../libs/logger';
import { Game, makeMove } from '../libs/Game'


/*
First add token to token enviroment variable
token=$(curl --request POST --url https://dev-8ti8osnq.us.auth0.com/oauth/token -H 'content-type: application/json' \
-d '{"client_id":"5AXHpewP0yBnJAya4yb2BUGf2abJCbQ8","client_secret":"6r7KiwsTG5YjYLOy8UIUeTHcKT3Et36SK4Vq4vL7SKo2rzz__xp7xRT9yshJqKVf","audience":"https://dicegame/api","grant_type":"client_credentials"}' | jq '.access_token')

echo $token
*/

export default function (db) {

    const errorMessage = { 'error': 'Something went wrong'}

    const router = Router();

    // Remove endpoint after finish developing
    router.get('/', async (req, res) => {
        try {
            const games = await db.find({})
            const playerID = games[0].game.currentPlayer
            const gameID = games[0]._id
            res.redirect(307, `./user/${playerID}/game/${gameID}`)
        } catch(err) {
            logger.error(err.message)
            res.send(errorMessage)
        }
    })

    // get all games
    // curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game
    router.get('/user/:userID/game', async (req, res) => {
        const userID = req.params.userID;
        try {
            const games = await db.getAllGames(userID)
            res.send(games)
        } catch(err) {
            logger.error(err.message)
            res.send(errorMessage)
        }
    });

    // get specific game
    // curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
// curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
    // curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
    router.get('/user/:userID/game/:gameID', async (req, res) => {
        const { userID, gameID } = req.params;
        try {
            const game = await db.getParticularGame(userID, gameID)
            res.send(game)
        } catch (err) {
            logger.debug(err.message)
            return res.send(errorMessage);
        }
    });

    // create a game
    // curl --url http://localhost:3000/api/v1/user/1/game/623a2a1bab1114ac2afabd9c -d '{"numberOfDices":5, "numberOfDiceSides": 6, "userIDs":["1", "2"]}' -H "Content-Type: application/json" -H "authorization: Bearer $token" 
// curl --url http://localhost:3000/api/v1/user/1/game/623a2a1bab1114ac2afabd9c -d '{"numberOfDices":5, "numberOfDiceSides": 6, "userIDs":["1", "2"]}' -H "Content-Type: application/json" -H "authorization: Bearer $token" 
    // curl --url http://localhost:3000/api/v1/user/1/game/623a2a1bab1114ac2afabd9c -d '{"numberOfDices":5, "numberOfDiceSides": 6, "userIDs":["1", "2"]}' -H "Content-Type: application/json" -H "authorization: Bearer $token" 
    router.post('/user/:userID/game', async (req, res) => {
        const userID = req.params.userID; 
        let userIDs = req.body.userIDs;
        userIDs = userIDs.includes(userID) ? userIDs : userIDs.concat(userID); // add user to game if is not added in list
        
        try {
            const game = new Game(userIDs)
<<<<<<< HEAD
            const dbgame = await db.createGame(game)
            logger.info(`Player ${userID} created game: ${dbGame._id}`)
            res.send(dbGame)
=======
            const dbGame = await db.createGame(game)
            logger.info(`Player ${userID} created game: ${dbGame._id}`)
            res.send({
                id: dbGame._id,
                playerIDs: dbGame.game.playerIDs
            })
>>>>>>> 08cce62 (Import db to router as param)
        } catch (err) {
            logger.error(err.message)
            res.send(errorMessage)
        }
    });


    // roll the dices
    // curl -d '{"numbersToChange":[1,2]}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
// curl -d '{"numbersToChange":[1,2]}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
    // curl -d '{"numbersToChange":[1,2]}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
    router.post('/user/:userID/game/:gameID', async (req, res) => {
        const { userID, gameID } = req.params;
        const { numbersToChange, chosenFigure } = req.body;
        
        try {
<<<<<<< HEAD
            const dbgame = await db.getParticularGame(userID, gameID)
            const game = await db.makeMove(dbGame.game, userID, numbersToChange, chosenFigure)
=======
            const dbGame = await db.getParticularGame(userID, gameID)
            const game = await makeMove(dbGame.game, userID, numbersToChange, chosenFigure)
>>>>>>> 08cce62 (Import db to router as param)
            await db.updateGame(gameID, game)
            logger.info(`Player ${userID} in game ${dbGame._id}`)
            res.send(game)
        } catch (err) {
<<<<<<< HEAD
            logger.error(err)
            res.send(err);
=======
            if(err.level === 'warning'){
                return res.send(err);
            }
           logger.error(err.message)
           res.send(errorMessage)
>>>>>>> 08cce62 (Import db to router as param)
        }
    })

    router.delete('/user/:userID/game', async (req, res) => {
        const userID = req.params.userID;
        try {
            await db.deleteAllGames(userID)
            logger.info(`Player ${userID} deleted all games`)
            res.send(`Delated all games`)
        } catch (err) {
            logger.error(err.message)
            res.send(errorMessage);
        }
    });

    router.delete('/user/:userID/game/:gameID', async (req, res) => {
        const { userID, gameID } = req.params;
        try {
            await db.deleteParticularGames(userID, gameID)
            logger.info(`Player ${gameID} deleted game: ${gameID}`);
            res.send(`Deleted game: ${gameID}`);
        } catch (err) {
            logger.error(err.message)
            res.send(errorMessage);
        }
    });

    return router;
}