export class Game {
    constructor(userIDs) {
        this.isActive = true;
        this.numberOfRoll = 0;
        this.numberOfTurn = 0;
        this.userIDs = userIDs;
        this.currentUser = userIDs[Math.floor(Math.random() * this.userIDs.length)];
        this.indexOfFirstPlayer = userIDs.indexOf(this.currentUser)

        this.mug = { "0": null, "1": null, "2": null, "3": null, "4": null }

        this.users = {}
        userIDs.forEach(id => {
            this.users[id] = {
                table : { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, 
                        "bonus": null, "3x": null, "4x": null, "full": null, 
                        "small strit": null, "big strit": null, "general": null, "chance": null, 
                        "sum": null, "total": null
                },
                
            }
        });
    }
}

export const rollTheDices = (game, dicesIndex, callback) => {

    const mug = game.mug;
    console.log(dicesIndex)

    for (let i = 0; i < dicesIndex.length; i++) {
        console.log(mug[dicesIndex[i]])
        mug[dicesIndex[i]] = Math.floor(Math.random() * 6) + 1
        console.log(mug[dicesIndex[i]])
    }
    game.numberOfRoll += 1

    callback(null, game)
}

export const countFigure = (game, chosenFigure) => {

    const userID = game.currentUser;
    const mug = Object.values(game.mug);
    const table = game.users[userID].table;

    const counter = [null,0,0,0,0,0,0]
    mug.forEach(dice => {
        counter[dice] +=1;
    })

    switch(chosenFigure) {
        case "1":
            table[chosenFigure] = counter[chosenFigure] * chosenFigure;
            break;
        case "2":
            table[chosenFigure] = counter[chosenFigure] * chosenFigure;
            break;
        case "3":
            table[chosenFigure] = counter[chosenFigure] * chosenFigure;
            break;
        case "4":
            table[chosenFigure] = counter[chosenFigure] * chosenFigure;
            break;
        case "5":
            table[chosenFigure] = counter[chosenFigure] * chosenFigure;
            break;
        case "6":
            table[chosenFigure] = counter[chosenFigure] * chosenFigure;
            break;
        case "3x":
            table[chosenFigure] = counter.map(number => number >= 3).includes(true) ? mug.reduce((sum, dice) => sum + dice, 0) : 0;
            break;
        case "4x":
            table[chosenFigure] = counter.map(number => number >= 4).includes(true) ? mug.reduce((sum, dice) => sum + dice, 0) : 0;
            break;
        case "full":
            table[chosenFigure] = ( counter.includes(3) && counter.includes(2) ) ? 25 : 0;
            break;
        case "small strit":
            table[chosenFigure] = ( counter[1] && counter[2] && counter[3] && counter[4] && counter[5] ) ? 30 : 0;
            break;
        case "big strit":
            table[chosenFigure] = ( counter[2] && counter[3] && counter[4] && counter[5] && counter[6] ) ? 40 : 0;
            break;
        case "general":
            table[chosenFigure] = counter.includes(5) ? 50 : 0;
            break;
        case "chance": 
            table[chosenFigure] = mug.reduce((sum, dice) => sum + dice, 0);
            break;
    }
}

export const saveFigure = (game, chosenFigure, callback) => {

    const userID = game.currentUser;
    const userIDs = game.userIDs;
    const numberOfTurn = game.numberOfTurn;
    const table = game.users[userID].table;
    const indexOfFirstPlayer = game.indexOfFirstPlayer;

    if(!table.hasOwnProperty(chosenFigure) || 
        chosenFigure === "bonus" ||
        chosenFigure === "sum" ||
        chosenFigure === "total" ) {
        callback(`You cannot choose figure: ${chosenFigure}`, null)
    } else if (table[chosenFigure] !== null) {
        callback("Figure already chosen", null)
    } else {
        countFigure(game, chosenFigure)
        game.numberOfRoll = 0
        const nextUserIndex = (userIDs.indexOf(userID) + 1) % userIDs.length
        game.currentUser = userIDs[nextUserIndex]
        if(nextUserIndex === indexOfFirstPlayer) {
            game.numberOfTurn += 1
        }
        
        if(numberOfTurn > 13) {
            game.isActive = false
        }

        callback(null, game)
    }
}

export const makeMove = (game, userID, numbersToChange, chosenFigure, callback) => {

    const isActive = game.isActive;
    const currentUser = game.currentUser;
    const numberOfRoll = game.numberOfRoll;

    if(!isActive){
        callback("Game is over", null)
    }
    if (userID !== currentUser) {
        callback(`This is turn of user: ${currentUser}`, null)
    }

    if(numberOfRoll === 0) {
        rollTheDices(game, [0,1,2,3,4], callback)
    } 
    else if(chosenFigure) {
        saveFigure(game, chosenFigure, callback)
    }
    else if (numberOfRoll < 3) {
        if (!numbersToChange){
            callback("You have to choose dice to rool on choose a figure", null)
        } else {
            rollTheDices(game, numbersToChange, callback)
        }
    } 
    else {
        if(!chosenFigure) {
            callback("You have to choose a figure", null)
        } else {
            saveFigure(game, chosenFigure, callback)
        }
    }
}
