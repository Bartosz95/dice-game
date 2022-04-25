import { mongoose } from './dbConnection'

const gameModel = mongoose.model("game", new mongoose.Schema({
    game: {}
}));

export const find = (params) => {
    return gameModel.find(params)
}

export const getAllGames = (userID) => {
    return gameModel.find({'game.playerIDs': [userID] });
}

export const getParticularGame = async (userID, gameID) => {
    return gameModel.findOne({ _id: gameID, 'game.playerIDs': [userID]})
}

export const createGame = (game) => {
    return gameModel.create({game})
}

export const updateGame = (gameID, game) => {
    return gameModel.findByIdAndUpdate(gameID, {game: game}, {new: true})
}

export const deleteAllGames = (userID) => {
    return gameModel.deleteMany({'game.playerIDs': [userID]})
}

export const deleteParticularGame = (userID, gameID) => {
    return gameModel.deleteOne({ _id: gameID, 'game.playerIDs': [userID]})
}