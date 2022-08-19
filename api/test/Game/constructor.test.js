import { assert } from 'assert'
import { Game, rollTheDices } from '../../libs/Game'

describe('Game', function () {

    let game
    let currentPlayer
    let deepCopieGame

    beforeEach(function () {
        game = new Game(
            [{ id:"abc", username: "anna" }, { id:"def", username: "jon" }], "Game 3")
        currentPlayer = game.currentPlayer;
        deepCopieGame = JSON.parse(JSON.stringify(game))
    })

    describe('#constructor()', function () {

        test('check if game has correct values at beggining', function () {
            expect(game.isActive).toBeTruthy();
            expect(game.numberOfRoll).toEqual(0)
            expect(game.numberOfTurn).toEqual(0)
            expect(game.playerIDs).toBeDefined()
            expect(game.currentPlayer).toBeDefined()
            expect(game.indexOfFirstPlayer).toBeDefined()
        })

        test('check if game has 5 dices', function () {
            expect(Object.keys(game.mug).length).toEqual(5)
        })

        test('check if dices has correct index', function () {
            expect(Object.keys(game.mug)).toEqual(['0','1','2','3','4'])
        })

        test('check if constructor create 2 of players ', function () {
            expect(Object.keys(game.players).length).toEqual(2)
        })

        test('check if player has table ', function () {
            expect(Object.keys(game.players[currentPlayer].table).length).toEqual(16)
        })

        test('check if constructor create 5 of players ', function () {
            game = new Game([
                { id:"abc", username: "anna" }, 
                { id:"def", username: "jon" }, 
                { id:"ghi", username: "mike" },
                { id:"jkl", username: "rod" }],
                 "Game 3")
            expect(Object.keys(game.players).length).toEqual(4)
        })
    })
})
