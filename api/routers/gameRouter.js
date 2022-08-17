import { Router } from 'express'
import logger from '../libs/logger';
import { Game, makeMove } from '../libs/Game'
import { validID, find, getAllGames, getParticularGame, createGame, updateGame, deleteAllGames, deleteParticularGame } from '../libs/dbGameWrapper'

/*
First add token to token enviroment variable
token=$(curl --request POST --url https://dev-8ti8osnq.us.auth0.com/oauth/token -H 'content-type: application/json' \
-d '{"client_id":"5AXHpewP0yBnJAya4yb2BUGf2abJCbQ8","client_secret":"6r7KiwsTG5YjYLOy8UIUeTHcKT3Et36SK4Vq4vL7SKo2rzz__xp7xRT9yshJqKVf","audience":"https://dicegame/api","grant_type":"client_credentials"}' | jq '.access_token')

echo $token
*/

const router = Router();

router.param('gameID', function (req, res, next, gameID) {
    try {
        if(!validID(gameID)) {
            throw new Error('gameID cannot be valid');
        }

    } catch (err) {
        logger.error(err)
        return res.send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'path': '/game/622cd907f6026dbf7cad27ef',
            }
        })
    }
    next()
})

// Remove endpoint after finish developing
router.get('/', async (req, res) => {
    try {
        const games = await find({})
        const playerID = games[0].game.currentPlayer
        const gameID = games[0]._id
        res.redirect(307, `./user/${playerID}/game/${gameID}`)
    } catch(err) {
        logger.error(err.message)
        res.send(err.message)
    }
})

// get all games
// curl -H 'authorization: Bearer $token' -H "Content-Type: application/json" -d '{"userID":"6224b5c30eac08007061fa31"}' http://localhost:3000/api/v1/game
router.get('/game', async (req, res) => {
    const userID = req.user.sid;

    try {
        const db_games = await getAllGames(userID)
        if(db_games.length == 0) 
            return res.send({
                'level': 'warning',
                'message':"User does not have any games"
            })
            
        res.status(200).send(
            db_games.map(db_game => { return {
                _id: db_game._id,
                isActive: db_game.game.isActive,
                playerIDs: db_game.game.playerIDs
            }})
        )
    } catch(err) {
        logger.error(err.message)
        res.send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'method': 'GET',
                'path': '/game'
            }
        })
    }
});

// create a game
// curl --url http://localhost:3000/api/v1/game -d '{"userIDs":["1","2"]}' -H "Content-Type: application/json" -H "authorization: Bearer $token" 
router.post('/game', async (req, res) => {
    let { name, users } = req.body;
    const currentUser = {
        id: req.user.sid,
        username: req.user.preferred_username
    }
    try {
        if(name === undefined)
            throw new Error('name is undefined');
        if(typeof name !== 'string') 
            throw new Error('name should be a string')
        if(users === undefined)
            throw new Error('users is undefined');
        if(!Array.isArray(users))
            throw new Error('users should be a Array');
        users.forEach(user => {
            if(typeof user.id !== 'string') 
                throw new Error('Every id in users array should be a string')
            if(typeof user.id !== 'string') 
                throw new Error('Every username in users array should be a string')
        })
        users = users.some(user => user.id === currentUser.id) ? users : users.concat(currentUser);
        users = users.map(user => user.id) // todo add game name and username later and remove this line
        
        const game = new Game(users)
        const dbGame = await createGame(game)
        logger.info(`Player ${currentUser.username} created game: ${dbGame._id}`)

        res.status(201).send({
            _id: dbGame._id,
            playerIDs: dbGame.game.playerIDs,
            currentPlayer: dbGame.game.currentPlayer
        })

    } catch (err) {
        logger.error(err.message)
        res.send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'header': 'Content-Type: application/json',
                'method': 'POST',
                'path': '/game/622cd907f6026dbf7cad27ef',
                'body': { 'userIDs': ["1","2"] }
            }
        })
    }
});

// delete all game for user
// curl -X DELETE  http://localhost:3000/api/v1/game
router.delete('/game', async (req, res) => {
    const userID = req.user.sid;
    try {
        await deleteAllGames(userID)
        logger.info(`Player ${userID} deleted all games`)
        res.send(`Delated all games`)
    } catch (err) {
        logger.error(err.message)
        res.send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'method': 'DELETE',
                'path': '/game'
            }
        });
    }
});

// get particulary game
// curl -H 'authorization: Bearer $token' http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
router.get('/game/:gameID', async (req, res) => {
    const { gameID } = req.params;
    const userID = req.user.sid;
    try {
        const game = await getParticularGame(userID, gameID)
        res.send(game)
    } catch (err) {
        logger.debug(err.message)
        return res.send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'method': 'GET',
                'path': '/game/622cd907f6026dbf7cad27ef'
            }
        });
    }
});

// roll dices
// curl -d '{"numbersToChange":[1,2]}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef
// choose figure
// curl -d '{"chosenFigure":"strit"}' -H 'authorization: Bearer $token' -H "Content-Type: application/json"  http://localhost:3000/api/v1/game/622cd907f6026dbf7cad27ef 
router.post('/game/:gameID', async (req, res) => {
    const { gameID } = req.params;
    const userID = req.user.sid;
    const { numbersToChange, chosenFigure } = req.body;
    try {
        if(numbersToChange === undefined && chosenFigure === undefined)
            throw new Error('Either numbersToChange or chosenFigure should be defined');
        if(chosenFigure && (typeof chosenFigure !== 'string')) {
            throw new Error('chosenFigure should be a string')
        }
        if(numbersToChange) {
            if(!Array.isArray(numbersToChange))
                throw new Error('numbersToChange should be a Array');
            numbersToChange.forEach(numberToChange => {
                if(typeof numberToChange !== 'string')
                    throw new Error('All ID in numbersToChange should be a string')
            })
        }

        const dbGame = await getParticularGame(userID, gameID)
        const game = await makeMove(dbGame.game, userID, numbersToChange, chosenFigure)
        await updateGame(gameID, game)
        logger.info(`Player ${userID} in game ${dbGame._id}`)
        res.send(game)
    } catch (err) {
        logger.error(err.message)
        res.send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'header': 'Content-Type: application/json',
                'method': 'POST',
                'path': '/game/622cd907f6026dbf7cad27ef',
                'body': { "numbersToChange": ["0", "1", "4"] },
                'body alternative': { "chosenFigure": "small strit" }
            }
        })
    }
})


// delete particulary game for user
router.delete('/game/:gameID', async (req, res) => {
    const { gameID } = req.params;
    const userID = req.user.sid;
    try {
        await deleteParticularGame(userID, gameID)
        logger.info(`Player ${gameID} deleted game: ${gameID}`);
        res.status(202).send({
            'level': 'info',
            'message': `Deleted game: ${gameID}`
        });
    } catch (err) {
        logger.error(err.message)
        res.send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'method': 'DELETE',
                'path': '/game/622cd907f6026dbf7cad27ef'
            }
        });
    }
});

export default router;