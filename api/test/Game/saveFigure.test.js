import { strict as assert } from 'assert';
import { Game, makeMove } from '../../services/Game'

describe('Game', function () {

    let game
    let currentPlayer
    let deepCopieGame
    let numbersToChange = undefined
  
    beforeEach(function () {
      game = new Game({ id:"abc", username: "anna" }, [{ id:"def", username: "jon" }], "Game 3")
      game.numberOfRoll = 1
      deepCopieGame = JSON.parse(JSON.stringify(game))
      currentPlayer = deepCopieGame.currentPlayer;
    })
  
    describe('#saveFigure()', function () {

        test('get error if figure is wrong',async function () {

            const chosenFigure = "to bonus"

            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, `You cannot choose figure: ${chosenFigure}`)
                assert.equal(game.numberOfRoll, 1)
                assert.equal(game.numberOfTurn, 0)
            }
        })

        test('get error if figure is already chosen',async function () {
            
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

        test('table is correct after save',async function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 3
            
            game.mug = mug
            deepCopieGame.mug = mug
            deepCopieGame.players[currentPlayer].table[chosenFigure] = result
            deepCopieGame.players[currentPlayer].table['to bonus'] = -60

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.deepEqual(game.players[currentPlayer], deepCopieGame.players[currentPlayer])
        })

        test('check if numberOfRoll is 0',async function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            
            game.mug = mug
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.numberOfRoll, 0)
        })

        test('check if user is changed', async function () {
            
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            
            game.mug = mug

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.notEqual(game.currentPlayer, deepCopieGame.currentPlayer)
        })

        test('check if to bonus is counted properly', async function () {
            
            const chosenFigure = "5"
            const mug = { "0": 5, "1": 5, "2": 1, "3": 3, "4": 1 }
            
            game.mug = mug

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.players[currentPlayer].table['to bonus'], -53)
        })

        test('check if to bonus is counted properly', async function () {
            
            const chosenFigure = "5"
            const mug = { "0": 5, "1": 5, "2": 1, "3": 5, "4": 1 }
            
            game.mug = mug
            game.players[currentPlayer].table['1'] = 3
            game.players[currentPlayer].table['2'] = 6
            game.players[currentPlayer].table['3'] = 9
            game.players[currentPlayer].table['4'] = 12
            game.players[currentPlayer].table['6'] = 18

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.players[currentPlayer].table['to bonus'], 0)
            assert.equal(game.players[currentPlayer].table['bonus'], 35)
        })

        test('check if to bonus is counted properly', async function () {
            
            const chosenFigure = "5"
            const mug = { "0": 5, "1": 5, "2": 5, "3": 5, "4": 1 }
            
            game.mug = mug
            game.players[currentPlayer].table['1'] = 6
            game.players[currentPlayer].table['2'] = 2
            game.players[currentPlayer].table['3'] = 6
            game.players[currentPlayer].table['4'] = 18
            game.players[currentPlayer].table['6'] = 21

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.players[currentPlayer].table['to bonus'], 0)
            assert.equal(game.players[currentPlayer].table['bonus'], 35)
        })

        test('check if to bonus is counted properly', async function () {
            
            const chosenFigure = "5"
            const mug = { "0": 1, "1": 1, "2": 5, "3": 5, "4": 1 }
            
            game.mug = mug
            game.players[currentPlayer].table['1'] = 2
            game.players[currentPlayer].table['2'] = 2
            game.players[currentPlayer].table['3'] = 3
            game.players[currentPlayer].table['4'] = 4
            game.players[currentPlayer].table['6'] = 6

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.players[currentPlayer].table['to bonus'], -36)
            assert.equal(game.players[currentPlayer].table['bonus'], null)
        })

        test('check if total is counted properly', async function () {
            
            const chosenFigure = "5"
 
            game.numberOfTurn = 12
            game.indexOfFirstPlayer = game.indexOfFirstPlayer === 0 ? 1 : 0
            game.mug = { "0": 1, "1": 1, "2": 5, "3": 5, "4": 5 }
            game.players[currentPlayer].table['1'] = 3
            game.players[currentPlayer].table['2'] = 6
            game.players[currentPlayer].table['3'] = 9
            game.players[currentPlayer].table['4'] = 12
            game.players[currentPlayer].table['6'] = 18
            game.players[currentPlayer].table['3x'] = 18
            game.players[currentPlayer].table['4x'] =20
            game.players[currentPlayer].table['full'] = 25
            game.players[currentPlayer].table['small strit'] = 30
            game.players[currentPlayer].table['big strit'] = 40
            game.players[currentPlayer].table['general'] = 50
            game.players[currentPlayer].table['chance'] = 36

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.players[currentPlayer].table['total'], 317)
        })
        test('check if total is counted properly with bonus', async function () {
            
            const chosenFigure = "5"
 
            game.numberOfTurn = 12
            game.indexOfFirstPlayer = game.indexOfFirstPlayer === 0 ? 1 : 0
            game.mug = { "0": 1, "1": 1, "2": 5, "3": 5, "4": 5 }
            game.players[currentPlayer].table['1'] = 3
            game.players[currentPlayer].table['2'] = 6
            game.players[currentPlayer].table['3'] = 9
            game.players[currentPlayer].table['4'] = 12
            game.players[currentPlayer].table['6'] = 18
            game.players[currentPlayer].table['3x'] = 18
            game.players[currentPlayer].table['4x'] = 20
            game.players[currentPlayer].table['full'] = 25
            game.players[currentPlayer].table['small strit'] = 30
            game.players[currentPlayer].table['big strit'] = 40
            game.players[currentPlayer].table['general'] = 50
            game.players[currentPlayer].table['chance'] = 36

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.players[currentPlayer].table['total'], 317)
        })

        test('check if total is counted properly without bonus', async function () {
            
            const chosenFigure = "5"
 
            game.numberOfTurn = 12
            game.indexOfFirstPlayer = game.indexOfFirstPlayer === 0 ? 1 : 0
            game.mug = { "0": 1, "1": 1, "2": 5, "3": 5, "4": 5 }
            game.players[currentPlayer].table['1'] = 3
            game.players[currentPlayer].table['2'] = 0
            game.players[currentPlayer].table['3'] = 3
            game.players[currentPlayer].table['4'] = 8
            game.players[currentPlayer].table['6'] = 12
            game.players[currentPlayer].table['3x'] = 18
            game.players[currentPlayer].table['4x'] = 12
            game.players[currentPlayer].table['full'] = 25
            game.players[currentPlayer].table['small strit'] = 30
            game.players[currentPlayer].table['big strit'] = 40
            game.players[currentPlayer].table['general'] = 0
            game.players[currentPlayer].table['chance'] = 21

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.players[currentPlayer].table['total'], 187)
        })
    })
})  