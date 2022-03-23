
export const rollTheDices = (game, dicesIndex) => {
    
    const mug = game.mug;
    
    for (let i = 0; i < dicesIndex.length; i++) {
        mug[dicesIndex[i]] = Math.floor(Math.random() * 6) + 1 
    }
    game.numberOfRoll += 1
}

export const saveFigure = (game, chosenFigure) => {

    const userID = game.currentUser;
    const userIDs = game.userIDs;
    const numberOfTurn = game.numberOfTurn;
    const table = game.users[userID].table;
    const indexOfFirstPlayer = game.indexOfFirstPlayer;

    if(!table.hasOwnProperty(chosenFigure) || table[chosenFigure] !== null) {
        throw "You cannot choose this figure"
    }

    game.users[userID].table[chosenFigure] = Object.values(game.mug)
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



