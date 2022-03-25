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

    describe('#constructor()', function () {
        it('check if constructor create 2 of players ', function () {
            assert.equal(Object.keys(game.users).length, 2)
        })

        it('check if player has table ', function () {
            assert.equal(Object.keys(game.users[currentUser].table).length, 16)
        })

        it('check if constructor create 5 of players ', function () {
            game = new Game(["1","2", "3", "4"])
            assert.equal(Object.keys(game.users).length, 4)
        })
    })
})
