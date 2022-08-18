import { Router } from 'express'
import logger from '../libs/logger';
import { Game, makeMove } from '../libs/Game'
import { validID, getAllGames, getParticularGame, createGame, updateGame, deleteAllGames, deleteParticularGame } from '../libs/dbGameWrapper'

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

router.get('/game', async (req, res) => {
    const userID = req.user.sub;

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
                playerIDs: db_game.game.playerIDs,
                isYourTurn: db_game.currentPlayer === userID
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

router.post('/game', async (req, res) => {
    let { name, users } = req.body;
    const currentUser = {
        id: req.user.sub,
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

router.delete('/game', async (req, res) => {
    const userID = req.user.sub;
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

router.get('/game/:gameID', async (req, res) => {
    const { gameID } = req.params;
    const userID = req.user.sub;
    try {
        const game = await getParticularGame(userID, gameID)
        game.isYourTurn = game.currentPlayer === userID
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
 
router.post('/game/:gameID', async (req, res) => {
    const { gameID } = req.params;
    const userID = req.user.sub;
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

router.delete('/game/:gameID', async (req, res) => {
    const { gameID } = req.params;
    const userID = req.user.sub;
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