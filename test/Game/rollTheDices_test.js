import assert from 'assert'
import { Game, makeMove } from '../../libs/Game'

describe('Game', async function () {

    let game
    let currentPlayer
    let deepCopieGame
    const chosenFigure = undefined

    beforeEach(function () {
        game = new Game(["abc","def"])
        game.numberOfRoll = 1
        deepCopieGame = JSON.parse(JSON.stringify(game))
        currentPlayer = deepCopieGame.currentPlayer;
    })

    describe('#rollTheDices()', function () {
        it('check is mug has 5 dices ', async function () {
            assert.equal(Object.keys(game.mug).length, 5)
        })

        it('check is mug has 5 dices after roll ', async function () {
            const numbersToChange = [0,1]
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.equal(Object.keys(game.mug).length, 5)
        })


        it('check is mug has 5 dices after roll ', async function () {
            const numbersToChange = []
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.equal(Object.keys(game.mug).length, 5)
        })


        it('check is mug has 5 dices after roll ', async function () {
            const numbersToChange = [0,1,2,3,4]
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.equal(Object.keys(game.mug).length, 5)
        })

        it('check if numberOfRoll is updated after roll ', async function () {
            const numbersToChange = [0,1,2,4,3]
            game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
            assert.equal(game.numberOfRoll, 2)
        })


        it('check wrong dices numbers', async function () {
            const numbersToChange = [0,1,2,3,4,5,6]
            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, 'Dices indexes are { 0, 1, 2, 3, 4 }')
            }
        })

        it('check wrong dices numbers', async function () {
            const numbersToChange = [0,1,-2]
            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, 'Dices indexes are { 0, 1, 2, 3, 4 }')
            }
        })

        it('check wrong dices numbers', async function () {
            const numbersToChange = [0,1,0.5]
            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, 'Dices indexes are { 0, 1, 2, 3, 4 }')
            }
        })

        it('check is mug return null for game for wrong indexes', async function () {
            const numbersToChange = [0,Infinity]
            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, 'Dices indexes are { 0, 1, 2, 3, 4 }')
            }
        })

        it('check is mug return error Message for wrong indexes', async function () {
            const numbersToChange = [0,1,'wrongdice']
            try {
                game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, 'Dices indexes are { 0, 1, 2, 3, 4 }')
            }
        })
    })
})