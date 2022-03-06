export default class Dice {

    constructor(numberOfSides) {
        this.numberOfSides = numberOfSides;
        this.roll();
    }

    roll() {
        this.number = Math.floor(Math.random() * this.numberOfSides) + 1
    }
}
