import Mug from './Mug';
import Dice from './Dice';

export  default class Game {
    constructor(countOfDices, countOfDiceSides) {
        
        const dices = []
        for (let i = 0; i < countOfDices; i++) {
            dices[i] = new Dice(countOfDiceSides);
        }
        this.mug = new Mug(dices);
    }
}

