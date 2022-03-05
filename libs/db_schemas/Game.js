import { mongoose } from 'mongoose'
import Game from '../game_modules/Game'

const Schema = mongoose.Schema;

exports.game = new Schema({
    game: Game
},{ 
    collection: "Games" 
});
