const Mug = require('./Mug');
const Dice = require('./Dice');


 module.exports = class Game {
    constructor(countOfDices, countOfDiceSides) {
        
        const dices = []
        for (let i = 0; i < countOfDices; i++) {
            dices[i] = new Dice(countOfDiceSides);
        }
        this.mug = new Mug(dices);
    }
}

