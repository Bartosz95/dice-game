import logger from "./logger";

export class Game {
    constructor(playerIDs) {
        this.isActive = true;
        this.numberOfRoll = 0;
        this.numberOfTurn = 0;
        this.playerIDs = playerIDs;
        this.currentPlayer = playerIDs[Math.floor(Math.random() * this.playerIDs.length)];
        this.indexOfFirstPlayer = playerIDs.indexOf(this.currentPlayer)

        this.mug = { "0": null, "1": null, "2": null, "3": null, "4": null }

        this.players = {}
        playerIDs.forEach(id => {
            this.players[id] = {
                table : { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, 
                        "to_bonus": null,"bonus": null, "3x": null, "4x": null, "full": null, 
                        "small strit": null, "big strit": null, "general": null, "chance": null, 
                         "total": null
                },
                
            }
        });
    }
}

const rollTheDices = (mug, dicesIndex) => {
    return new Promise( (resolve, reject) => {

        if(dicesIndex.filter(index => (index > 4) || (index < 0) || (Math.floor(index) != index) ).length > 0) {
            return reject({level: "warning", message: 'Dices indexes are { 0, 1, 2, 3, 4 }'})
        }
        for (let i = 0; i < dicesIndex.length; i++) {
            mug[dicesIndex[i]] = Math.floor(Math.random() * 6) + 1
        }
        resolve(mug)
    })
}

const saveFigure = (table, chosenFigure, result) => {
    return new Promise((resolve, reject) => {
        if(!table.hasOwnProperty(chosenFigure) || 
            chosenFigure === "bonus" ||
            chosenFigure === "to_bonus" ||
            chosenFigure === "total" ) {
            reject({level: "warning", message: `You cannot choose figure: ${chosenFigure}`})
        } else if (table[chosenFigure] !== null) {
            reject({level: "warning", message: 'Figure already chosen'})
        }
        table[chosenFigure] = result
        resolve(table)
        
    })
}

const countResult = (mug, chosenFigure) => {
    return new Promise( (resolve, reject ) => {
        
        const countMug = Object.values(mug);
        const counter = [null,0,0,0,0,0,0]
        countMug.forEach(dice => {
            counter[dice] +=1;
        })
        switch(chosenFigure) {
            case "1":
                resolve(counter[chosenFigure] * chosenFigure);
                break;
            case "2":
                resolve(counter[chosenFigure] * chosenFigure);
                break;
            case "3":
                resolve(counter[chosenFigure] * chosenFigure);
                break;
            case "4":
                resolve(counter[chosenFigure] * chosenFigure);
                break;
            case "5":
                resolve(counter[chosenFigure] * chosenFigure);
                break;
            case "6":
                resolve(counter[chosenFigure] * chosenFigure);
                break;
            case "3x":
                resolve(counter.map(number => number >= 3).includes(true) ? countMug.reduce((to_bonus, dice) => to_bonus + dice, 0) : 0);
                break;
            case "4x":
                resolve(counter.map(number => number >= 4).includes(true) ? countMug.reduce((to_bonus, dice) => to_bonus + dice, 0) : 0);
                break;
            case "full":
                resolve((counter.includes(3) && counter.includes(2) ) ? 25 : 0);
                break;
            case "small strit":
                resolve((counter[1] && counter[2] && counter[3] && counter[4] && counter[5] ) ? 30 : 0);
                break;
            case "big strit":
                resolve((counter[2] && counter[3] && counter[4] && counter[5] && counter[6] ) ? 40 : 0);
                break;
            case "general":
                resolve(counter.includes(5) ? 50 : 0);
                break;
            case "chance": 
                resolve(countMug.reduce((to_bonus, dice) => to_bonus + dice, 0));
                break;
            default:
                reject({level: "warning", message: `You cannot choose figure: ${chosenFigure}`})
        }
        
    })
}

const getNextPlayer = (playerIDs, currentPlayer) =>{
    const nextUserIndex = (playerIDs.indexOf(currentPlayer) + 1) % playerIDs.length
    return playerIDs[nextUserIndex]
}

const getTurn = (playerIDs, currentPlayer, indexOfFirstPlayer) => {
    return playerIDs.indexOf(currentPlayer) === indexOfFirstPlayer ? 1 : 0
}

const isGameEnd = (numberOfTurn) => {
    return numberOfTurn < 13
}

const saveFigureandUpdateGame = async (game, chosenFigure) => {
    const result = await countResult(game.mug, chosenFigure);
    game.players[game.currentPlayer].table = await saveFigure(game.players[game.currentPlayer].table, chosenFigure, result);
    game.numberOfRoll = 0
    game.currentPlayer = getNextPlayer(game.playerIDs, game.currentPlayer);
    game.numberOfTurn += getTurn(game.playerIDs, game.currentPlayer, game.indexOfFirstPlayer)
    game.isActive = isGameEnd(game.numberOfTurn)
    return game
}

const rollTheDicesAndUpdateGame = async (game, dicesToChange) => {
    game.mug = await rollTheDices(game.mug, dicesToChange)
    game.numberOfRoll += 1
    return game;
}

export function makeMove(game, playerID, dicesToChange, chosenFigure) {
    return new Promise(async (resolve, reject) => {
        try {
        const isActive = game.isActive;
        const currentPlayer = game.currentPlayer;
        const numberOfRoll = game.numberOfRoll;
        
        if(!isActive){
            return reject({level: "warning", message: 'Game is over'})
        }
        if (playerID !== currentPlayer) {
            return reject({level: "warning", message: `This is turn of user: ${currentPlayer}`})
        }
        if(numberOfRoll === 0) {
            return resolve(rollTheDicesAndUpdateGame(game, [0,1,2,3,4]))
        } 
        else if(chosenFigure) {
            return resolve(saveFigureandUpdateGame(game, chosenFigure))
        }
        else if (numberOfRoll < 3) {
            if (!dicesToChange){
                return reject({level: "warning", message: 'You have to choose dice to rool on choose a figure'})
            }
            return resolve(rollTheDicesAndUpdateGame(game, dicesToChange))
        } 
        else {
            if(!chosenFigure) {
                return reject({level: "warning", message: 'You have to choose a figure'})
            } 
            return resolve(saveFigureandUpdateGame(game, chosenFigure))
            
        }
    } catch (err) {
        return reject({level: "error", message: err.message})
    }
        
    })
}

