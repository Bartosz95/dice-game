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
       
    
    test('create game: post /user/:userID/game', async () => {
        const res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game`).send({ "userIDs": [currentPlayer, "xyz"]}).set('Accept', 'application/json')
        expect(res.status).toEqual(201)
        expect(res.body).toHaveProperty('_id')
        expect(res.body).toHaveProperty('currentPlayer')
        expect(res.body).toHaveProperty('playerIDs')
        expect(res.body.playerIDs).toEqual([currentPlayer, "xyz"])
    })
    
    test('get all games for user: get /user/:userID/game', async () => {
        currentPlayer = 'abc'
        const res = await request(app).get(`${APP_URL}/user/${currentPlayer}/game`)
        expect(res.status).toEqual(200)
        res.body.forEach(game => {
            expect(game).toHaveProperty('_id')
            expect(game.isActive).toBeTruthy()
            //expect(game.playerIDs).toEqual(expect.arrayContaining([currentPlayer])); // todo 
        })
    })

    test('get particular game for user: get /user/:userID/game/:gameID', async () => {
        const res = await request(app).get(`${APP_URL}/user/${currentPlayer}/game/${gameID}`)
        expect(res.status).toEqual(200)
        
        expect(res.body).toHaveProperty('_id')
        expect(res.body).toHaveProperty('game')
        expect(res.body).toHaveProperty('game', game)
    })

    describe('makeMove: get /user/:userID/game/:gameID', () => {

        test('roll first time dices', async () => {
            const res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game/${gameID}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
            const db_game = await getParticularGame(currentPlayer, gameID)

            expect(res.status).toEqual(200)
            expect(res.body).toEqual(db_game.game)
            expect(res.body.mug['0']).not.toBeNull()
            expect(res.body.mug['1']).not.toBeNull()
            expect(res.body.mug['2']).not.toBeNull()
            expect(res.body.mug['3']).not.toBeNull()
            expect(res.body.mug['4']).not.toBeNull()
            expect(res.body.mug).not.toHaveProperty('5')
        })
    
        test('save figure', async () => {
            const chosenFigure = 'full'

            let res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game/${gameID}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
            res = await request(app).post(`${APP_URL}/user/${currentPlayer}/game/${gameID}`).send({ "chosenFigure": chosenFigure}).set('Accept', 'application/json')
            const db_game = await getParticularGame(currentPlayer, gameID)
            
            expect(res.status).toEqual(200)
            expect(res.body).toEqual(db_game.game)
            expect(res.body.players[currentPlayer].table[chosenFigure]).not.toBeNull()
        })
    })
})