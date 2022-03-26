import assert from 'assert'
import { Game, makeMove } from '../../libs/Game'

describe('Game', function () {

    let game
    let currentUser
    let deepCopieGame
  
    beforeEach(function () {
      game = new Game(["abc","def"])
      currentUser = game.currentUser;
      deepCopieGame = JSON.parse(JSON.stringify(game))
    })
  
    describe('#makeMove()', function () {

        it('get error if game is ended', function () {

            const numbersToChange = [0,1]
            const chosenFigure = undefined
            
            game.isActive = false
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(game, null)
                assert.equal(errorMessage, 'Game is over')
            })
        })

        it('get error if user is not active', function () {

            const numbersToChange = [0,1]
            const chosenFigure = undefined
            const wrongUser = game.currentUser === 'abc' ? 'def' : 'abc'

            makeMove(game, wrongUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(game, null)
                assert.equal(errorMessage, `This is turn of user: ${currentUser}`)
            })
        })

        it('mug has the  all after roll first one in turn', function () {
            const numbersToChange = undefined
            const chosenFigure = undefined
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.ok(game.mug['0'])
                assert.ok(game.mug['1'])
                assert.ok(game.mug['2'])
                assert.ok(game.mug['3'])
                assert.ok(game.mug['4'])
            })
        })

        it('mug has 5 dices after roll', function () {
            const numbersToChange = undefined
            const chosenFigure = undefined
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(Object.keys(game.mug).length, 5)
            })
        })

        it('update numberOfRoll', function () {
            const numbersToChange = undefined
            const chosenFigure = undefined
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(game.numberOfRoll, 1)
            })
        })

        it('numberOfRoll is 0 after choice figure', function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(game.numberOfRoll, 0)
            })
        })

        it('user is change after choice figure', function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.notEqual(game.currentUser, deepCopieGame.currentUser)
            })
        })

        it('figure is saved after choice figure', function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 3
            const numberOfRoll = 1

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            deepCopieGame.users[currentUser].table[chosenFigure] = result
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.deepEqual(game.users[currentUser].table, deepCopieGame.users[currentUser].table)
            })
        })

        it('numberOfTurn is updated after choice figure for last player', function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1
            const indexOfFirstPlayer = game.indexOfFirstPlayer === 0 ? 1 : 0

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            game.indexOfFirstPlayer = indexOfFirstPlayer
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(game.numberOfTurn, 1)
            })
        })

        it('user is change after choice figure for last player', function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1
            const indexOfFirstPlayer = game.indexOfFirstPlayer === 0 ? 1 : 0

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            game.indexOfFirstPlayer = indexOfFirstPlayer
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.notEqual(game.currentUser, deepCopieGame.currentUser)
            })
        })

        it('numberOfRoll is 0 after choice figure for last player', function () {
            
            const numbersToChange = undefined
            const chosenFigure = "1"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const numberOfRoll = 1
            const indexOfFirstPlayer = game.indexOfFirstPlayer === 0 ? 1 : 0

            game.mug = mug
            game.numberOfRoll = numberOfRoll
            game.indexOfFirstPlayer = indexOfFirstPlayer
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(game.numberOfRoll, 0)
            })
        })

        it('get error if numbersToChange and chosenFigure is undefined and numberOfRoll < 3', function () {
            
            const numbersToChange = undefined
            const chosenFigure = undefined
            const numberOfRoll = 2

            game.numberOfRoll = numberOfRoll
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(game, null)
                assert.equal(errorMessage, "You have to choose dice to rool on choose a figure")
            })
        })

        it('rollTheDices if numberOfRoll < 3', function () {
            
            const numbersToChange = [0,2,3]
            const chosenFigure = undefined
            const numberOfRoll = 2

            game.numberOfRoll = numberOfRoll
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.ok(game.mug['0'])
                assert.equal(game.mug['1'], null)
                assert.ok(game.mug['2'])
                assert.ok(game.mug['3'])
                assert.equal(game.mug['4'], null)
                assert.equal(game.numberOfRoll, 3)
            })
        })

        it('get error if numberOfRoll is 3 and chosenFigure is undefined', function () {
            
            const numbersToChange = [0, 1]
            const chosenFigure = undefined
            const numberOfRoll = 3

            game.numberOfRoll = numberOfRoll
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.equal(game, null)
                assert.equal(errorMessage, "You have to choose a figure")
            })
        })

        it('saveFigure if numberOfRoll is 3', function () {
            
            const numbersToChange = undefined
            const chosenFigure = "3x"
            const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
            const result = 8
            const numberOfRoll = 3
            
            game.mug = mug
            game.numberOfRoll = numberOfRoll
            deepCopieGame.users[currentUser].table[chosenFigure] = result
            makeMove(game, currentUser, numbersToChange, chosenFigure, (errorMessage, game) => {
                assert.deepEqual(game.users[currentUser].table, deepCopieGame.users[currentUser].table)
            })
        })
    })
})