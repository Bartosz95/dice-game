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

        it('get error if figure is wrong', function () {
            
            const chosenFigure = "sum"
            const numberOfRoll = 1

            saveFigure(game, chosenFigure, (errorMessage, game) => {
                assert.equal(game, null)
                assert.equal(errorMessage, `You cannot choose figure: ${chosenFigure}`)
            })
            assert.equal(game.numberOfRoll, 0)
            assert.equal(game.numberOfTurn, 0)
        })

        it('get error if figure is already chosen', function () {
            
            const chosenFigure = "small strit"
            const currentResult = 0

            game.users[currentUser].table[chosenFigure] = currentResult
            saveFigure(game, chosenFigure, (errorMessage, game) => {
                assert.equal(game, null)
                assert.equal(errorMessage, "Figure already chosen")
            })
            assert.equal(game.numberOfRoll, 0)
            assert.equal(game.numberOfTurn, 0)
        })

        it('table is correct after save', function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 3
            
            game.mug = mug
            deepCopieGame.mug = mug
            deepCopieGame.users[currentUser].table[chosenFigure] = result
            saveFigure(game, chosenFigure, (errorMessage, game) => {
                assert.deepEqual(game.users[currentUser], deepCopieGame.users[currentUser])
            })
        })

        it('check if numberOfRoll is 0', function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            
            game.mug = mug
            saveFigure(game, chosenFigure, (errorMessage, game) => {
                assert.equal(game.numberOfRoll, 0)
            })
        })

        it('check if user is changed', function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            
            game.mug = mug
            saveFigure(game, chosenFigure, (errorMessage, game) => {
                assert.notEqual(game.currentUser, deepCopieGame.currentUser)
            })
        })
    })
})  