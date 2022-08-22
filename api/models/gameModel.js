import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({ game: {}}, { timestamps: true })

gameSchema.post('findOne',  async function (doc) {

    
    const query = this.getQuery()
    const userID = query['game.playerIDs']['$in'][0]
    if(doc.game.players[userID].checked) {
        return
    }
    doc.game.players[userID].checked = true
    await this.model.findByIdAndUpdate(query._id, { game: doc.game })

  });

export default mongoose.model("game", gameSchema);

