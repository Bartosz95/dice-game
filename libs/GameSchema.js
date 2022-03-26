import { mongoose } from './db'
import logger from '../libs/logger';

export const gameModel =  mongoose.model("game", new mongoose.Schema({
    game: {}
}));

export const getAllGames = (userID, callback) => {
    const userIDstring = `game.users.${userID}`;
    gameModel.find({userIDstring : { $exists: true}} , (err, docs) => {
        if(err) {
          logger.error(err)
          return callback(err, null);
        }
        callback(null, docs);
    });
}

export const getParticularGame = (userID, gameID, callback) => {
    const userIDstring = `game.users.${userID}`;
    gameModel.findOne({ _id: gameID, userIDstring : { $exists: true}}, (err, doc) => {
        if(err) {
          logger.error(err)
          return callback(err, null);
        }
        callback(null, doc);
    });
}

export const createGame = (game, callback) => {
    const instance = new gameModel({game});
    instance.save((err) => {
        if(err) {
            logger.error(err)
            return callback(err, null)
        }
        logger.info(`Created game ${instance._id}`)
        callback(null, instance);
    });
}

export const updateGame = (gameID, game, callback) => {
    gameModel.findByIdAndUpdate(gameID, {game: game} , (err, message) => {
        if(err) {
            logger.error(err);
        }
        callback(err);
    })
}

export const deleteAllGames = (userID, callback) => {
    const userIDstring = `game.users.${userID}`;
    gameModel.deleteMany({userIDstring : { $exists: true}}, (err) => {
        if(err){
            logger.error(err);
        }
        
        callback(err || null)
    })
}

export const deleteParticularGames = (userID, gameID, callback) => {
    const userIDstring = `game.users.${userID}`;
    const numberOfGames = gameModel.deleteOne({ _id: gameID, userIDstring : { $exists: true}}, (err) => {
        if(err){
            logger.error(err);
        }
        callback(err || null)
    })
}