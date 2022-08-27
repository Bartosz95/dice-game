import { Router } from 'express'
import mongoose from 'mongoose'

import logger from '../libs/logger';
import { Game, makeMove } from '../services/Game'
import '../libs/dbConnection'
import gameModel from '../models/gameModel'

const PREFIX = `process.env.PREFIX` || ''
const errorMessage = "Something went wrong. Please try again later"


const router = Router();

router.param('gameID', (req, res, next, gameID) => {
    try {
        if(!mongoose.isValidObjectId(gameID)) {
            throw new Error('gameID cannot be valid');
        }
    } catch (err) {
        logger.debug(err.message)
        return res.status(400).send({
            'level': 'warning',
            'message': err.message,
            'example': {
                'path': `${PREFIX}/game/622cd907f6026dbf7cad27ef`,
            }
        })
    }
    next()
})

router.get('/game/ping', async (req, res) => {
    try {
        const userID = req.user.sub;
        const match = {'game.playerIDs': [userID] }
        const docs = await gameModel.find(match)
        const numberOfNew = docs.filter(doc => !doc.game.players[userID].checked).length
        const numberOfYourTurn = docs.filter(doc => doc.game.currentPlayer === userID).length
        res.send({ numberOfNew: numberOfNew, numberOfYourTurn: numberOfYourTurn})
    } catch (err) {
        logger.debug(err.message)
        return res.status(504).send({
            'level': 'warning',
            'message': errorMessage,
            'example': {
                'method': 'GET',
                'path': `${PREFIX}/game/ping`
            }
        });
    }
});

router.get('/game', async (req, res) => {

    try{
        const userID = req.user.sub;
        const match = {'game.playerIDs': [userID] }
        if(req.query.isActive) {
            match.isActive = req.query.isActive === 'ture'
        }

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
        logger.debug({level: 'info', message: `User ${userID} get all ${games.length} games`})
        res.send(games)
        
    } catch (err) {
        logger.error(err.message)
        return res.status(504).send({
            'level': 'error',
            'message': errorMessage,
       })  
    }
});

router.post('/game', async (req, res) => {
    try {
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
                if(!user.id || !user.username){
                    throw new Error('Every user should contain id and username')
                }
                if(typeof user.id !== 'string') 
                    throw new Error('Every user id should be a string')
                if(typeof user.username !== 'string') 
                    throw new Error('Every user username should be a string')
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
            logger.debug(`User ${currentUser.id} has warning ${err.message} when try to create game`)
            res.status(400).send({
                level: 'warning',
                message: err.message,
                example: {
                    header: 'Content-Type: application/json',
                    method: 'POST',
                    path: `${PREFIX}/game`,
                    body: { 
                        users: [{
                            id: '3281cc50-a5fe-44cb-b629-f94d3a45d42c',
                            username: 'tom'
                        },{
                            id: '3281cc50-a5fe-44cb-b629-f94d3a45d42d',
                            username: 'ana'
                        }],
                        name: "Game 1"
                    }
                }
            })
        }
    } catch (err) {
        logger.error(err.message)
        return res.status(504).send({
            'level': 'error',
            'message': errorMessage,
       })  
    }
    
});

router.delete('/game', async (req, res) => {
    try {
        const userID = req.user.sub;
        const { deleteMany } = await gameModel.deleteMany({'game.playerIDs': [userID]})
        logger.info(`User ${userID} delete his all ${deleteMany} games.`)
        res.send({ level: 'info', message: `Delated all games for user ${userID}`
        })
    } catch (err) {
        logger.error(err.message)
        return res.status(504).send({
            'level': 'error',
            'message': errorMessage,
       })  
    }
});

router.get('/game/:gameID', async (req, res) => {
    try {
        const { gameID } = req.params;
        const userID = req.user.sub;
        try {
            let doc
                try {
                    doc = await gameModel.findOne({ _id: gameID, 'game.playerIDs': [userID]})
                } catch (err) {
                    logger.debug(`User ${userID} send wrong gameID: ${gameID}`)
                    throw Error('Wrong gameID')
                }
            
            if(doc === null){
                throw new Error('Game not exist')
            }
            if(!doc.game.playerIDs.includes(userID)){
                throw new Error('You do not play in this game')
            }
            doc.game.isYourTurn = doc.game.currentPlayer === userID
            logger.debug(`User ${userID} get game ${gameID}`)
            res.send(doc)
        } catch (err) {
            logger.debug(`User ${userID} in game ${gameID} has error ${err.message} when try to get this game`)
            return res.status(400).send({
                'level': 'warning',
                'message': err.message,
            })  
        }
    } catch (err) {
        logger.error(err.message)
        return res.status(504).send({
            'level': 'error',
            'message': errorMessage,
        });
    }
});
 
router.post('/game/:gameID', async (req, res) => {
    try {
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

            let doc = null
            try {
                doc = await gameModel.findOne({ _id: gameID, 'game.playerIDs': [userID]}).exec()
            } catch (err) {
                logger.error(`User ${userID} in ${gameID} has error: ${err.message}`)
                return res.status(504).send({
                    'level': 'error',
                    'message': errorMessage,
               })  
            }
            const game = await makeMove(doc.game, userID, numbersToChange, chosenFigure)

            try {
                await gameModel.findByIdAndUpdate(gameID, {game: game}, {new: true})
            } catch (err) {
                logger.error(`User ${userID} in ${gameID} has error: ${err.message}`)
                return res.status(504).send({
                    'level': 'error',
                    'message': errorMessage,
               })  
            }
            logger.debug(`User ${userID} in game ${gameID} send dices: [${numbersToChange}] and figure: ${chosenFigure}`)
            res.send(game)

        } catch (err) {
            logger.debug(`User ${userID} in game ${gameID} has error ${err.message} when make a move`);
            res.status(400).send({
                level: 'warning',
                message: err.message,
                example: {
                    header: 'Content-Type: application/json',
                    method: 'POST',
                    path: `${PREFIX}/game/622cd907f6026dbf7cad27ef`,
                    body: { "numbersToChange": ["0", "1", "4"] },
                    'body alternative': { "chosenFigure": "small strit" }
                }
            })
        }
    } catch (err) {
        logger.error(err)
        return res.status(504).send({
            level: 'error',
            message: errorMessage,
       })  
    }
})

router.delete('/game/:gameID', async (req, res) => {
    try {
        const { gameID } = req.params;
        const userID = req.user.sub;
        await gameModel.deleteOne({ _id: gameID, 'game.playerIDs': [userID]})
        logger.debug(`User ${gameID} deleted game ${gameID}`);
        res.status(202).send({
            'level': 'info',
            'message': `You delete game ${gameID}`
        });
    } catch (err) {
        logger.debug(`User ${userID} in game ${gameID} has error ${err.message} when delete it `);
        logger.debug()
        res.status(504).send({
            level: 'error',
            message: errorMessage,
        });
    }
});

export default router;