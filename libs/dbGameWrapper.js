import { mongoose } from './dbConnection'

const gameModel = mongoose.model("game", new mongoose.Schema({
    game: {}
}));

exports.find = (params) => {
    return gameModel.find(params)
}

exports.getAllGames = (userID) => {
<<<<<<< HEAD
    const userIDstring = `game.users.${userID}`;
    return gameModel.find({userIDstring : { $exists: true}}) 
}

exports.getParticularGame = (userID, gameID) => {
    const userIDstring = `game.users.${userID}`;
=======
    const userIDstring = `game.playerIDs.${userID}`;
    return gameModel.find({userIDstring : { $exists: true}}) 
}

exports.getParticularGame = async (userID, gameID) => {
    const userIDstring = `game.playerIDs.${userID}`;
>>>>>>> 08cce62 (Import db to router as param)
    return gameModel.findOne({ _id: gameID, userIDstring : { $exists: true}})
}

exports.createGame = (game) => {
    return gameModel.create({game})
}

exports.updateGame = (gameID, game) => {
    return gameModel.findByIdAndUpdate(gameID, {game: game})
}

exports.deleteAllGames = (userID) => {
<<<<<<< HEAD
    const userIDstring = `game.users.${userID}`;
=======
    const userIDstring = `game.playerIDs.${userID}`;
>>>>>>> 08cce62 (Import db to router as param)
    return gameModel.deleteMany({userIDstring : { $exists: true}})
}

exports.deleteParticularGames = (userID, gameID) => {
<<<<<<< HEAD
    const userIDstring = `game.users.${userID}`;
=======
    const userIDstring = `game.playerIDs.${userID}`;
>>>>>>> 08cce62 (Import db to router as param)
    return gameModel.deleteOne({ _id: gameID, userIDstring : { $exists: true}})
}