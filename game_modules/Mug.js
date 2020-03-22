const Dice = require('./Dice');

class Mug {

    constructor(dices) {
        this.dices = dices;
    }

    rollTheDices(...numberOnTopSide) {
        if(numberOnTopSide.length == 0) 
            this.dices.forEach((item) => {
                item.roll()
            });
        else {
            numberOnTopSide = numberOnTopSide.splice(0, this.dices.length);
            this.dices.forEach((item) => {
                if(numberOnTopSide.includes(item.number)){
                    delete numberOnTopSide[numberOnTopSide.indexOf(item.number)];
                    item.roll()
                }
            });
        }
    }
}

module.exports = Mug;