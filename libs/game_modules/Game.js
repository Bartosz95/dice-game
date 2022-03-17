import Mug from './Mug';
import Dice from './Dice';

export default class Game {
    constructor(numberOfDices, numberOfDiceSides, userIDs) {
        this.turn = 0
        this.current_turn = {
            current_user: userIDs[Math.floor(Math.random() * userIDs.length)],
            numberOfRoll: 0
        }
        const dices = []
        for (let i = 0; i < numberOfDices; i++) {
            dices[i] = new Dice(numberOfDiceSides);
        }
        this.mug = new Mug(dices);
        this.userIDs = userIDs;

        this.table = {}
        this.userIDs.forEach(id => {
            this.table[id] = {   "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, 
                                "bonus": null, "3x": null, "4x": null, "full": null, 
                                "small strit": null, "big strit": null, "general": null, "chance": null, 
                                "sum": null, "total": null
            }
        });
        
         
    }
}

