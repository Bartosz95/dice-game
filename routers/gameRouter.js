import { Router } from 'express'
import logger from '../libs/logger';
import { Game, makeMove } from '../libs/Game'
import { find, getAllGames, getParticularGame, createGame, updateGame, deleteAllGames, deleteParticularGame } from '../libs/dbGameWrapper'


/*
First add token to token enviroment variable
token=$(curl --request POST --url https://dev-8ti8osnq.us.auth0.com/oauth/token -H 'content-type: application/json' \
-d '{"client_id":"5AXHpewP0yBnJAya4yb2BUGf2abJCbQ8","client_secret":"6r7KiwsTG5YjYLOy8UIUeTHcKT3Et36SK4Vq4vL7SKo2rzz__xp7xRT9yshJqKVf","audience":"https://dicegame/api","grant_type":"client_credentials"}' | jq '.access_token')

echo $token
*/

const errorMessage = { 'error': 'Something went wrong'}

const router = Router();

// Remove endpoint after finish developing
router.get('/', async (req, res) => {
    try {
        const games = await find({})
        const playerID = games[0].game.currentPlayer
        const gameID = games[0]._id
        res.redirect(307, `./user/${playerID}/game/${gameID}`)
    } catch(err) {
        logger.error(err.message)
        res.send(errorMessage)
    }
})

// get all games
// curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/user/1/game
router.get('/user/:userID/game', async (req, res) => {
    const userID = req.params.userID;
    try {
        const db_games = await getAllGames(userID)
        if(db_games.length === 0) 
            res.send("User does not have any games")
        
        res.status(200).send(
            db_games.map(db_game => { return {
            _id: db_game._id,
            isActive: db_game.game.isActive,
            playerIDs: db_game.game.playerIDs
        }}))
    } catch(err) {
        logger.error(err.message)
        res.send(errorMessage)
    }
});

// get particulary game
// curl -H 'authorization: Bearer $token' http://localhost:3000/api/v1/user/1/game/622cd907f6026dbf7cad27ef 
router.get('/user/:userID/game/:gameID', async (req, res) => {
    const { userID, gameID } = req.params;
    try {
        const game = await getParticularGame(userID, gameID)
        res.send(game)
    } catch (err) {
        logger.debug(err.message)
        return res.send(errorMessage);
    }
});

// create a game
// curl --url http://localhost:3000/api/v1/user/1/game -d '{"userIDs":["1","2"]}' -H "Content-Type: application/json" -H "authorization: Bearer $token" 
router.post('/user/:userID/game', async (req, res) => {
    const userID = req.params.userID; 
    let userIDs = req.body.userIDs;
    userIDs = userIDs.includes(userID) ? userIDs : userIDs.concat(userID); // add user to game if is not added in list
    
    try {
        const game = new Game(userIDs)
        const dbGame = await createGame(game)
        logger.info(`Player ${userID} created game: ${dbGame._id}`)
        res.status(201).send({
            _id: dbGame._id,
            playerIDs: dbGame.game.playerIDs,
            currentPlayer: dbGame.game.currentPlayer
        })
    } catch (err) {
        logger.error(err.message)
        res.send(errorMessage)
    }
});


// roll dices
// curl -d '{"numbersToChange":[1,2]}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/user/1/game/622cd907f6026dbf7cad27ef
// choose figure
// curl -d '{"chosenFigure":"strit"}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/user/1/game/622cd907f6026dbf7cad27ef 
router.post('/user/:userID/game/:gameID', async (req, res) => {
    const { userID, gameID } = req.params;
    const { numbersToChange, chosenFigure } = req.body;
    try {
        const dbGame = await getParticularGame(userID, gameID)
        const game = await makeMove(dbGame.game, userID, numbersToChange, chosenFigure)
        await updateGame(gameID, game)
        logger.info(`Player ${userID} in game ${dbGame._id}`)
        res.send(game)
    } catch (err) {
        if(err.level === 'warning'){
            return res.send(err);
        }
        logger.error(err.message)
        res.send(errorMessage)
    }
})

// delete all game for user
// curl -X DELETE  http://localhost:3000/api/v1/user/1/game
router.delete('/user/:userID/game', async (req, res) => {
    const userID = req.params.userID;
    try {
        await deleteAllGames(userID)
        logger.info(`Player ${userID} deleted all games`)
        res.send(`Delated all games`)
    } catch (err) {
        logger.error(err.message)
        res.send(errorMessage);
    }
});

// delete particulary game for user
router.delete('/user/:userID/game/:gameID', async (req, res) => {
    const { userID, gameID } = req.params;
    try {
        await deleteParticularGame(userID, gameID)
        logger.info(`Player ${gameID} deleted game: ${gameID}`);
        res.send(`Deleted game: ${gameID}`);
    } catch (err) {
        logger.error(err.message)
        res.send(errorMessage);
    }
});

export default router;