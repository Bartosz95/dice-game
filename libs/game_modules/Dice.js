export default class Dice {

    countOfDiceSides

    constructor(countOfDiceSides) {
        this.countOfDiceSides = countOfDiceSides;
        this.roll();
    }

    roll() {
        this.number = Math.floor(Math.random() * this.countOfDiceSides) + 1
    }
}
