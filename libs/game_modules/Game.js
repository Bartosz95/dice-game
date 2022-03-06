import Mug from './Mug';
import Dice from './Dice';

export default class Game {
    constructor(numberOfDices, numberOfDicesides) {
        
        const dices = []
        for (let i = 0; i < numberOfDices; i++) {
            dices[i] = new Dice(numberOfDicesides);
        }
        this.mug = new Mug(dices);
    }
}

