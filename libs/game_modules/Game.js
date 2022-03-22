
export const rollTheDices = (mug, dicesIndex) => {
    for (let i = 0; i < dicesIndex.length; i++) {
        mug[dicesIndex[i]] = Math.floor(Math.random() * 6) + 1 
    }
    return mug
}

export class Game {
    constructor(userIDs) {
        this.isActive = true;
        this.numberOfTurn = 0
        this.currentUser = userIDs[Math.floor(Math.random() * userIDs.length)]
        this.currentRoll = 0

        this.users = {}
        userIDs.forEach(id => {
            this.users[id] = {
                table : { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, 
                        "bonus": null, "3x": null, "4x": null, "full": null, 
                        "small strit": null, "big strit": null, "general": null, "chance": null, 
                        "sum": null, "total": null
                },
                mug : rollTheDices( 
                    { "0": null, "1": null, "2": null, "3": null, "4": null },
                    [0,1,2,3,4]
                )
            }
        });
    }
}



