import assert from 'assert'
import { Game, rollTheDices } from '../../libs/Game'

describe('Game', function () {

    let game
    let currentUser
    let deepCopieGame

    beforeEach(function () {
        game = new Game(["abc","def"])
        currentUser = game.currentUser;
        deepCopieGame = JSON.parse(JSON.stringify(game))
    })

    describe('#rollTheDices()', function () {
        it('check is mug has 5 dices ', function () {
            assert.equal(Object.keys(game.mug).length, 5)
        })

        it('check is mug has 5 dices after roll ', function () {
            rollTheDices(game, [0,1], (errorMessage, game) => {
                assert.equal(Object.keys(game.mug).length, 5)
            })
        })


        it('check is mug has 5 dices after roll ', function () {
            rollTheDices(game, [], (errorMessage, game) => {
                assert.equal(Object.keys(game.mug).length, 5)
            })
        })


        it('check is mug has 5 dices after roll ', function () {
            rollTheDices(game, [0,1,2,3,4], (errorMessage, game) => {
                assert.equal(Object.keys(game.mug).length, 5)
            })
        })

        it('check if numberOfRoll is updated after roll ', function () {
            rollTheDices(game, [0,1,2,3,4], (errorMessage, game) => {
                assert.equal(game.numberOfRoll, 1)
            })
        })


        it('check is mug return null for game for wrong indexes', function () {
            rollTheDices(game, [0,1,2,3,4,5,6], (errorMessage, game) => {
                assert.equal(game, null)
            })
        })

        it('check is mug return null for game for wrong indexes', function () {
            rollTheDices(game, [0,1,-2], (errorMessage, game) => {
                assert.equal(game, null)
            })
        })

        it('check is mug return null for game for wrong indexes', function () {
            rollTheDices(game, [0,1,0.5], (errorMessage, game) => {
                assert.equal(game, null)
            })
        })

        it('check is mug return null for game for wrong indexes', function () {
            rollTheDices(game, [0,'wrong dice index', 2], (errorMessage, game) => {
                assert.equal(game, null)
            })
        })

        it('check is mug return error Message for wrong indexes', function () {
            rollTheDices(game, [0,1,2,3,4,5,6], (errorMessage, game) => {
                assert.ok(errorMessage)
            })
        })
    })
})