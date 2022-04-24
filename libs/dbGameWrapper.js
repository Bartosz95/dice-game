import { mongoose } from './dbConnection'

const gameModel = mongoose.model("game", new mongoose.Schema({
    game: {}
}));

export const find = (params) => {
    return gameModel.find(params)
}

export const getAllGames = (userID) => {
    const userIDstring = `game.players.${userID}`;
    return gameModel.find({userIDstring : { $exists: true}})
}

export const getParticularGame = async (userID, gameID) => {
    const userIDstring = `game.playerIDs`;
    return gameModel.findOne({ _id: gameID, userIDstring : { $exists: true}})
}

export const createGame = (game) => {
    return gameModel.create({game})
}

export const updateGame = (gameID, game) => {
    return gameModel.findByIdAndUpdate(gameID, {game: game})
}

export const deleteAllGames = (userID) => {
    const userIDstring = `game.playerIDs.${userID}`;
    return gameModel.deleteMany({userIDstring : { $exists: true}})
}

export const deleteParticularGame = (userID, gameID) => {
    const userIDstring = `game.playerIDs.${userID}`;
    return gameModel.deleteOne({ _id: gameID, userIDstring : { $exists: true}})
}