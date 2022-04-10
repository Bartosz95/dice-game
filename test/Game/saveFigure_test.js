import assert from 'assert'
import { Game, makeMove } from '../../libs/Game'

describe('Game',async function () {

    let game
    let currentPlayer
    let deepCopieGame
    let numbersToChange = undefined
  
    beforeEach(function () {
      game = new Game(["abc","def"])
      game.numberOfRoll = 1
      deepCopieGame = JSON.parse(JSON.stringify(game))
      currentPlayer = deepCopieGame.currentPlayer;
    })
  
    describe('#saveFigure()', function () {

        it('get error if figure is wrong',async function () {

            const chosenFigure = "sum"

            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, `You cannot choose figure: ${chosenFigure}`)
                assert.equal(game.numberOfRoll, 1)
                assert.equal(game.numberOfTurn, 0)
            }
        })

        it('get error if figure is already chosen',async function () {
            
            const chosenFigure = "small strit"
            const currentResult = 0

            game.players[currentPlayer].table[chosenFigure] = currentResult
            try {
                await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, "Figure already chosen")
                assert.equal(game.numberOfRoll, 1)
                assert.equal(game.numberOfTurn, 0)
            }

        })

        it('table is correct after save',async function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 3
            
            game.mug = mug
            deepCopieGame.mug = mug
            deepCopieGame.players[currentPlayer].table[chosenFigure] = result

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.deepEqual(game.players[currentPlayer], deepCopieGame.players[currentPlayer])
        })

        it('check if numberOfRoll is 0',async function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            
            game.mug = mug
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.numberOfRoll, 0)
        })

        it('check if user is changed', async function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            
            game.mug = mug

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.notEqual(game.currentPlayer, deepCopieGame.currentPlayer)
        })
    })
})  