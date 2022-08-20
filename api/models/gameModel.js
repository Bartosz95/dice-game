import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({ game: {}}, { timestamps: true })

export default mongoose.model("game", gameSchema);

