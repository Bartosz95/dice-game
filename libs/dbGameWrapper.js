import { mongoose } from './dbConnection'

export const gameModel =  mongoose.model("game", new mongoose.Schema({
    game: {}
}));

export const getAllGames = (userID) => {
    const userIDstring = `game.users.${userID}`;
    return gameModel.find({userIDstring : { $exists: true}}) 
}

export const getParticularGame = (userID, gameID) => {
    const userIDstring = `game.users.${userID}`;
    return gameModel.findOne({ _id: gameID, userIDstring : { $exists: true}})
}

export const createGame = (game) => {
    return gameModel.create({game})
}

export const updateGame = (gameID, game) => {
    return gameModel.findByIdAndUpdate(gameID, {game: game})
}

export const deleteAllGames = (userID) => {
    const userIDstring = `game.users.${userID}`;
    return gameModel.deleteMany({userIDstring : { $exists: true}})
}

export const deleteParticularGames = (userID, gameID) => {
    const userIDstring = `game.users.${userID}`;
    return gameModel.deleteOne({ _id: gameID, userIDstring : { $exists: true}})
}