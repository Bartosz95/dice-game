import Mug from './Mug';
import Dice from './Dice';

export default class Game {
    constructor(numberOfDices, numberOfDiceSides, user_ids) {
        
        const dices = []
        for (let i = 0; i < numberOfDices; i++) {
            dices[i] = new Dice(numberOfDiceSides);
        }
        this.mug = new Mug(dices);
        this.user_ids = user_ids;
    }
}

