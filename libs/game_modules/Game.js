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
    console.log("rollTheDices")
    const mug = game.mug;

    for (let i = 0; i < dicesIndex.length; i++) {
        mug[dicesIndex[i]] = Math.floor(Math.random() * 6) + 1 
    }
    game.numberOfRoll += 1

    callback(null, game)
}

export const countFigure = (game, chosenFigure, callback) => {

    const userID = game.currentUser;
    const mug = Object.values(game.mug);
    const table = game.users[userID].table;

    const figureNumber = parseInt(chosenFigure)

    if(figureNumber !== NaN) {
        table[chosenFigure] = mug.filter(number => number === figureNumber).length * figureNumber;
    } else {
        switch(chosenFigure) {
            case "bonus":
                
                break;
            case "3x":
                
                break;
            case "4x":
                
                break;
            case "full":
                
                break;
            case "small strit":
                
                break;
            case "big strit":
                
                break;
            case "general":
                
                break;
            case "chance": 
                table[chosenFigure] = mug.reduce((sum, number) => sum + number, 0)
                break;
        }
    }
    callback(null, game)
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
        countFigure(game, chosenFigure, callback)
        game.numberOfRoll = 0
        const nextUserIndex = (userIDs.indexOf(userID) + 1) % userIDs.length
        game.currentUser = userIDs[nextUserIndex]
        if(nextUserIndex === indexOfFirstPlayer) {
            game.numberOfTurn += 1
        }
        
        if(numberOfTurn > 13) {
            game.isActive = false
        }
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
