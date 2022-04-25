import request from "supertest"

import { getAllGames, getParticularGame, createGame, deleteAllGames} from '../libs/dbGameWrapper'
import { Game } from '../libs/Game'
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
       
    
    test('create game: post /user/:userID/game', async () => {
        const res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game`).send({ "userIDs": [currentPlayer, "xyz"]}).set('Accept', 'application/json')
        expect(res.status).toEqual(201)
        expect(res.body).toHaveProperty('_id')
        expect(res.body).toHaveProperty('currentPlayer')
        expect(res.body).toHaveProperty('playerIDs')
        expect(res.body.playerIDs).toEqual([currentPlayer, "xyz"])
    })

    describe("get all games for user: get /user/:userID/game", () => {

        test('games are return correctly', async () => {
            currentPlayer = 'abc'
            const res = await request(app).get(`${APP_URL}/user/${currentPlayer}/game`)
            expect(res.status).toEqual(200)
        })
    })

    test('get particular game for user: get /user/:userID/game/:gameID', async () => {
        const res = await request(app).get(`${APP_URL}/user/${currentPlayer}/game/${gameID}`)
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('_id')
        expect(res.body).toHaveProperty('game', game)
    })

    describe('makeMove: get /user/:userID/game/:gameID', () => {

        test('roll first time dices', async () => {
            const res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game/${gameID}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
            const db_game = await getParticularGame(currentPlayer, gameID)

            expect(res.status).toEqual(200)
            expect(res.body).toEqual(db_game.game)
            expect(res.body.numberOfRoll).toEqual(1)
            expect(res.body).toEqual(db_game.game)
            expect(res.body.mug['0']).not.toBeNull()
            expect(res.body.mug['1']).not.toBeNull()
            expect(res.body.mug['2']).not.toBeNull()
            expect(res.body.mug['3']).not.toBeNull()
            expect(res.body.mug['4']).not.toBeNull()
            expect(res.body.mug).not.toHaveProperty('5')
        })

        test('roll dices by wrong player', async () => {
            const wrongCurrentPlayer = currentPlayer === "abc" ? "def" : "abc"

            const res = await request(app).post(`${APP_URL}/user/${wrongCurrentPlayer}/game/${gameID}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')

            expect(res.status).toEqual(200)
            expect(res.body).toHaveProperty("level", 'warning')
            expect(res.body).toHaveProperty("message", `This is turn of user: ${currentPlayer}`)
            await expect(getParticularGame(currentPlayer, gameID)).resolves.toHaveProperty('game', db_game.game)
        })

        test('roll dices for not exist game', async () => {

            const res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game/123`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
            expect(res.status).toEqual(200)
            expect(res.body).toHaveProperty("error", 'Something went wrong')
        })
    
        test('save figure', async () => {
            const chosenFigure = 'full'

            let res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game/${gameID}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
            res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game/${gameID}`).send({ "chosenFigure": chosenFigure}).set('Accept', 'application/json')
            const db_game = await getParticularGame(currentPlayer, gameID)
            
            expect(res.status).toEqual(200)
            expect(res.body.numberOfRoll).toEqual(0)
            expect(res.body).toEqual(db_game.game)
            expect(res.body.players[currentPlayer].table[chosenFigure]).not.toBeNull()
        })
    })

    test('delete all game for user: delete /user/:userID/game', async () => {

        console.log(currentPlayer)
        await expect(getAllGames(currentPlayer)).resolves.toHaveLength(2)

        const res = await request(app).delete(`${APP_URL}/user/${currentPlayer}/game`)
        
        expect(res.status).toEqual(200)
        await expect(getAllGames(currentPlayer)).resolves.toHaveLength(0)
        await expect(getAllGames('ghi')).resolves.toHaveLength(1)
        
    })

    test('delete particular game for user: delete /user/:userID/game/:gameID', async () => {

        await expect(getAllGames(currentPlayer)).resolves.toHaveLength(2)
        await expect(getParticularGame(currentPlayer, gameID)).resolves.toBeTruthy()

        const res = await request(app).delete(`${APP_URL}/user/${currentPlayer}/game/${gameID}`)
        
        expect(res.status).toEqual(200)
        await expect(getParticularGame(currentPlayer, gameID)).resolves.toBeNull()
        await expect(getAllGames(currentPlayer)).resolves.toHaveLength(1)
        await expect(getAllGames("ghi")).resolves.toHaveLength(2)
    })
})