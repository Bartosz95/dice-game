import assert from 'assert'
import { Game, rollTheDices } from '../../libs/Game'

describe('Game', function () {

    let game
    let currentPlayer
    let deepCopieGame

    beforeEach(function () {
        game = new Game(["abc","def"])
        currentPlayer = game.currentPlayer;
        deepCopieGame = JSON.parse(JSON.stringify(game))
    })

    describe('#constructor()', function () {

        it('check if game has correct values at beggining', function () {
            assert.equal(game.isActive, true)
            assert.equal(game.numberOfRoll, 0)
            assert.equal(game.numberOfTurn, 0)
            assert.ok(game.playerIDs)
            assert.ok(game.currentPlayer)
            assert.ok(game.indexOfFirstPlayer)
        })

        it('check if game has 5 dices', function () {
            assert.equal(Object.keys(game.mug).length, 5)
        })

        it('check if dices has correct index', function () {
            assert.deepEqual(Object.keys(game.mug), ['0','1','2','3','4'])
        })

        it('check if constructor create 2 of players ', function () {
            assert.equal(Object.keys(game.players).length, 2)
        })

        it('check if player has table ', function () {
            assert.equal(Object.keys(game.players[currentPlayer].table).length, 16)
        })

        it('check if constructor create 5 of players ', function () {
            game = new Game(["1","2", "3", "4"])
            assert.equal(Object.keys(game.players).length, 4)
        })
    })
})
