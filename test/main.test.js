import request from "supertest"

import { getAllGames, getParticularGame, createGame, updateGame, deleteAllGames, deleteParticularGame } from '../libs/dbGameWrapper'
import { Game, makeMove } from '../libs/Game'
import app from '../main.js'

describe('E2E', () => {

    const APP_URL = process.env.APP_URL
    let game
    let deepCopieGame
    let currentPlayer
    let db_game
    let gameID

    beforeEach(async function () {
        await deleteAllGames("abc")
        await deleteAllGames("def")
        await deleteAllGames("ghi")
        await deleteAllGames("jkl")
        await createGame(new Game(["abc","ghi"]))
        await createGame(new Game(["ghi","def"]))
        game = new Game(["abc","def"])

        deepCopieGame = JSON.parse(JSON.stringify(game))
        currentPlayer = deepCopieGame.currentPlayer;
        db_game = await createGame(game)
        gameID = db_game._id.toString()
    })
    
    test('get /user/:userID/game', async () => {
        currentPlayer = 'abc'
        const res = await request(app).get(`${APP_URL}/user/${currentPlayer}/game`)
        expect(res.status).toEqual(200)
        // expect(res.body).toHaveLength(1) // todo get shoult return only games for one user
    })
})