import { strict as assert } from 'assert';
import { Game, makeMove } from '../../libs/Game'

describe('Game', function () {

    let game
    let currentPlayer
    let deepCopieGame
  
    beforeEach(function () {
      game = new Game(
            [{ id:"abc", username: "anna" }, { id:"def", username: "jon" }], "Game 3")
      deepCopieGame = JSON.parse(JSON.stringify(game))
      currentPlayer = deepCopieGame.currentPlayer;
    })
  
    describe('#makeMove()', function () {

        test('get error if game is ended', async function () {

            const numbersToChange = [0,1]
            const chosenFigure = undefined
            
            game.isActive = false

            try {
                await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, 'Game is over')
            }
        })

        test('after last move game.isActive is false', async function () {
            const numbersToChange = undefined;
            const chosenFigure = "1";
            const numberOfRoll = 1;
            const numberOfTurn = 12;
            const indexOfFirstPlayer = game.indexOfFirstPlayer == 0 ? 1 : 0;
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 };

            game.numberOfRoll = numberOfRoll;
            game.numberOfTurn = numberOfTurn;
            game.indexOfFirstPlayer = indexOfFirstPlayer;
            game.mug = mug;

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            expect(game.isActive).toBeFalsy()
        })

        test('get error if user is not active', async function () {

            const numbersToChange = [0,1]
            const chosenFigure = undefined
            const wrongUser = currentPlayer === 'abc' ? 'def' : 'abc'
            try {
                await makeMove(game, wrongUser, numbersToChange, chosenFigure);
                assert.fail()
            } catch (err) {
                assert.equal(err.message, `This is turn of user: ${currentPlayer}`)
            }
            
        })

        test('mug has the  all after roll first one in turn', async function () {
            const numbersToChange = undefined
            const chosenFigure = undefined
            
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.ok(game.mug['0'])
            assert.ok(game.mug['1'])
            assert.ok(game.mug['2'])
            assert.ok(game.mug['3'])
            assert.ok(game.mug['4'])
        })

        test('mug has 5 dices after roll', async function () {
            const numbersToChange = undefined
            const chosenFigure = undefined
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.equal(Object.keys(game.mug).length, 5)
        })

        test('update numberOfRoll', async function () {
            const numbersToChange = undefined
            const chosenFigure = undefined

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.equal(game.numberOfRoll, 1)
        })

        test('numberOfRoll is 0 after choice figure', async function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.equal(game.numberOfRoll, 0)
        })

        test('user is change after choice figure', async function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.notEqual(game.currentPlayer, deepCopieGame.currentPlayer)
        })

        test('figure is saved after choice figure', async function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 3
            const numberOfRoll = 1

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            deepCopieGame.players[currentPlayer].table[chosenFigure] = result
            deepCopieGame.players[currentPlayer].table['to bonus'] = -60

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.deepEqual(game.players[currentPlayer].table, deepCopieGame.players[currentPlayer].table)
        })

        test('numberOfTurn is updated after choice figure for last player', async function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1
            const indexOfFirstPlayer = game.indexOfFirstPlayer == 0 ? 1 : 0

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            game.indexOfFirstPlayer = indexOfFirstPlayer

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.numberOfTurn, 1)
        })

        test('user is change after choice figure for last player', async function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1
            const indexOfFirstPlayer = game.indexOfFirstPlayer === 0 ? 1 : 0

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            game.indexOfFirstPlayer = indexOfFirstPlayer

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.notEqual(game.currentPlayer, deepCopieGame.currentPlayer)
        })

        test('numberOfRoll is 0 after choice figure for last player', async function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1
            const indexOfFirstPlayer = game.indexOfFirstPlayer === 0 ? 1 : 0

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            game.indexOfFirstPlayer = indexOfFirstPlayer

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.equal(game.numberOfRoll, 0)
        })

        test('get error if numbersToChange and chosenFigure is undefined and numberOfRoll < 3', async function () {
            
            const numbersToChange = undefined
            const chosenFigure = undefined
            const numberOfRoll = 2

            game.numberOfRoll = numberOfRoll
            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            } catch (err) {
                assert.equal(err.message, "You have to choose dice to rool on choose a figure")
            }
        })

        test('rollTheDices if numberOfRoll < 3', async function () {
            
            const numbersToChange = [0,2,3]
            const chosenFigure = undefined
            const numberOfRoll = 2

            game.numberOfRoll = numberOfRoll

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

            assert.ok(game.mug['0'])
            assert.equal(game.mug['1'], null)
            assert.ok(game.mug['2'])
            assert.ok(game.mug['3'])
            assert.equal(game.mug['4'], null)
            assert.equal(game.numberOfRoll, 3)
        })

        test('get error if numberOfRoll is 3 and chosenFigure is undefined', async function () {
            
            const numbersToChange = [0, 1]
            const chosenFigure = undefined
            const numberOfRoll = 3

            game.numberOfRoll = numberOfRoll
            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            } catch (err) {
                assert.equal(err.message, "You have to choose a figure")
            }
        })

        test('saveFigure if numberOfRoll is 3', async function () {
            
            const numbersToChange = undefined
            const chosenFigure = "3x"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 8
            const numberOfRoll = 3
            
            game.mug = mug
            game.numberOfRoll = numberOfRoll
            deepCopieGame.players[currentPlayer].table[chosenFigure] = result
            deepCopieGame.players[currentPlayer].table['to bonus'] = -63

            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.deepEqual(game.players[currentPlayer].table, deepCopieGame.players[currentPlayer].table)
        })
    })
})