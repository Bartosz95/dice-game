import { Router } from 'express'
import mongoose from 'mongoose'

import logger from '../libs/logger';
import { Game, makeMove } from '../services/Game'
import '../libs/dbConnection'
import gameModel from '../models/gameModel'

const router = Router();

router.param('gameID', function (req, res, next, gameID) {
    try {
        if(!mongoose.isValidObjectId(gameID)) {
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

router.get('/game/ping', async (req, res) => {
    const userID = req.user.sub;

    try {
        const match = {'game.playerIDs': [userID] }
        const docs = await gameModel.find(match)
        const numberOfNew = docs.filter(doc => !doc.game.players[userID].checked).length
        const numberOfYourTurn = docs.filter(doc => doc.game.currentPlayer === userID).length
        res.send({ numberOfNew: numberOfNew, numberOfYourTurn: numberOfYourTurn})

    } catch (err) {
        logger.debug(err.message)
        return res.send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'method': 'GET',
                'path': '/game/ping'
            }
        });
    }
});

router.get('/game', async (req, res) => {
    const userID = req.user.sub;

    const match = {'game.playerIDs': [userID] }
    if(req.query.isActive) {
        match.isActive = req.query.isActive === 'ture'
    }

    try {
        const docs = await gameModel.find(match);

        const games = docs.map(doc => { return {
            _id: doc._id,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            name: doc.game.name,
            isActive: doc.game.isActive,
            checked: doc.game.players[userID].checked,
            players: doc.game.playerIDs.map(_id => { return {
                _id: _id,
                username: doc.game.players[_id].username
            }}),
            numberOfTurn: doc.game.numberOfTurn,
            isYourTurn: doc.game.currentPlayer === userID
        }})
        res.send(games)
        
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
        
        const game = new Game(currentUser, users, name)
        const doc = await gameModel.create({game})
        logger.info(`Player ${currentUser.id} created game: ${doc._id}`)

        res.status(201).send({
            _id: doc._id,
            playerIDs: doc.game.playerIDs,
            currentPlayer: doc.game.currentPlayer
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
        await gameModel.deleteMany({'game.playerIDs': [userID]})
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
        const game = await gameModel.findOne({ _id: gameID, 'game.playerIDs': [userID]})
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

        const doc = await gameModel.findOne({ _id: gameID, 'game.playerIDs': [userID]})
        const game = await makeMove(doc.game, userID, numbersToChange, chosenFigure)
        await gameModel.findByIdAndUpdate(gameID, {game: game}, {new: true})
        logger.info(`Player ${userID} in game ${doc._id}`)
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
        await gameModel.deleteOne({ _id: gameID, 'game.playerIDs': [userID]})
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