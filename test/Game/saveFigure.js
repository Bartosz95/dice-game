import assert from 'assert'
import { Game, saveFigure } from '../../libs/Game'

describe('Game', function () {

    let game
    let currentUser
    let deepCopieGame
  
    beforeEach(function () {
      game = new Game(["abc","def"])
      currentUser = game.currentUser;
      deepCopieGame = JSON.parse(JSON.stringify(game))
    })
  
    describe('#saveFigure()', function () {

        it('table is correct after save', function () {
            
            const figure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 3
            
            game.mug = mug
            deepCopieGame.mug = mug
            deepCopieGame.users[currentUser].table[figure] = result

            saveFigure(game, figure, (errorMessage, game) => {
                assert.deepEqual(game.users[currentUser], deepCopieGame.users[currentUser])
            })
        })

        it('check if numberOfRoll is 0', function () {
            
            const figure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 3
            
            game.mug = mug
            deepCopieGame.mug = mug
            deepCopieGame.users[currentUser].table[figure] = result

            saveFigure(game, figure, (errorMessage, game) => {
                assert.equal(game.numberOfRoll, 0)
            })
        })

        it('check if user is changed', function () {
            
            const figure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            
            game.mug = mug

            saveFigure(game, figure, (errorMessage, game) => {
                assert.notEqual(game.currentUser, deepCopieGame.currentUser)
            })
        })
    })
})  