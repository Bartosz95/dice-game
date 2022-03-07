import { mongoose } from '../db'

export default mongoose.model("game", new mongoose.Schema({
    game: {}
}));
