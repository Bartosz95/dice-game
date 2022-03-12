import logger from "../logger";
import Dice from "./Dice";
export default class Mug {

    constructor(dices) {
        this.dices = dices;
        this.numberOfDices = dices.length;
    }

    rollTheDices(numbersOnTopSide) {
        logger.info(numbersOnTopSide);
        if(numbersOnTopSide.length == 0) 
        this.dices = this.dices.map(dice => new Dice(dice.numberOfSides))
        else {
            numbersOnTopSide = numbersOnTopSide.splice(0, this.dices.length);
            this.dices = this.dices.map(dice => {
                if(numbersOnTopSide.includes(dice.number)){
                    delete numbersOnTopSide[numbersOnTopSide.indexOf(dice.number)];
                    dice = new Dice(dice.numberOfSides);
                }
                return dice;
            });
        }
    }
}