const Mug = require('./Mug');
const Dice = require('./Dice');


class Game {
    constructor(countOfDices, countOfDiceSides) {
        this.countOfDiceSides = countOfDiceSides;
        this.countOfDices = countOfDices;

        this.dices = []
        for (let i = 0; i < countOfDices; i++) {
            this.dices[i] = new Dice(countOfDiceSides);
        }
    }
} 

module.exports = Game;
