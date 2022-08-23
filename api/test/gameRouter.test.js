import request from "supertest"
const https = require('https');
import jwt_decode from "jwt-decode";
import gameModel from "../models/gameModel"
import { Game , makeMove} from '../services/Game'
import app from '../app'

describe('E2E', () => {

    const APP_URL = process.env.APP_URL
    let game
    let deepCopieGame
    let currentPlayer
    let db_game
    let gameID
    let token
    let currentUser

    beforeAll(async () => {
        
        const requestBody = new URLSearchParams({
            'grant_type':'password',
            'client_id':'dice-game',
            'username':'tom',
            'password':'password'
        })

        const requestOptions = {
            hostname: 'dice-game',
            port: 443,
            path: '/auth/realms/bolo/protocol/openid-connect/token',
            method: 'POST',
            rejectUnauthorized: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': requestBody.toString().length
            }
        };
        
        const request = https.request(requestOptions, response => {
            let responseBody = '';
            
            response.on('data', chunk => {
                responseBody += chunk
            });

            response.on('end', () => {
                token = JSON.parse(responseBody).access_token
                const decodedToken = jwt_decode(token)
                currentUser = { id: decodedToken.sub, username: decodedToken.preferred_username }
            })
        });
        
        request.on('error', (e) => {
            console.error(e);
        });

        request.write(requestBody.toString());
        request.end();
    })

    beforeEach(async function () {
        console.log(token)
        console.log(currentUser)
        await gameModel.deleteMany({'game.playerIDs': [currentUser.id]})
        await gameModel.deleteMany({'game.playerIDs': ["def"]})
        game = new Game(currentUser, [{ id:"def", username: "jon" }], "Game 1")
        deepCopieGame = JSON.parse(JSON.stringify(game))
        currentPlayer = currentUser.id
        db_game = await gameModel.create(game)
        gameID = db_game._id.toString()
    })
       

    describe("endpoint: /game", () => {
        describe("get: get all games for user", () => {
            test('games are return correctly', async () => {
                await gameModel.create(new Game(currentUser,[{ id: "ghi", username: "mike"}], "Game 2"))
                console.log(token)
                const res = await request(app).get(`/game`).set('Authorization', `Bearer ${token}`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveLength(2)
                res.body.forEach(game => {
                    expect(game).toHaveProperty('playerIDs')
                    expect(game.playerIDs).toEqual(expect.arrayContaining([currentPlayer]));
                })
            })

            test('user has not any game', async () => {
                await gameModel.deleteMany({'game.playerIDs': [currentPlayer]})
                const res = await request(app).get(`/game`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveProperty('message', "User does not have any games")
            })

            test('User not exist', async () => {
                const userID = 'notExist'
                const res = await request(app).get(`/${userID}/game`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveProperty('message', "User does not have any games")
            })
        })

        describe("post: create game", () => {
            test('Game is created correctly', async () => {
                const res = await request(app).post(`/game`).send({ "userIDs": [currentPlayer, "xyz"]}).set('Accept', 'application/json')
                expect(res.status).toEqual(201)
                expect(res.body).toHaveProperty('_id')
                expect(res.body).toHaveProperty('currentPlayer')
                expect(res.body).toHaveProperty('playerIDs')
                expect(res.body.playerIDs).toEqual(expect.arrayContaining([currentPlayer, "xyz"]));
            })

            test('Add request owner to game', async () => {
                const res = await request(app).post(`/game`).send({ "userIDs": [ "xyz"]}).set('Accept', 'application/json')
                expect(res.status).toEqual(201)
                expect(res.body).toHaveProperty('_id')
                expect(res.body).toHaveProperty('currentPlayer')
                expect(res.body).toHaveProperty('playerIDs')
                expect(res.body.playerIDs).toEqual(expect.arrayContaining([currentPlayer, "xyz"]));
            })

            test('return error if userIDs is not a Array', async () => {
                const res = await request(app).post(`/game`).send({ "userIDs": "xyz"}).set('Accept', 'application/json')
                expect(res.body).toHaveProperty('message', 'userIDs should be a Array')
            })

            test('return error if any of userID in userIDs is not a string', async () => {
                const res = await request(app).post(`/game`).send({ "userIDs": [ "xyz", 1] }).set('Accept', 'application/json')
                expect(res.body).toHaveProperty('message', 'Every user in userIDs should be a string')
            })
        })

        describe("delete: delete all game for user", () => {
            beforeEach(async function () {
                await gameModel.deleteMany({'game.playerIDs': ["ghi"]})
                await gameModel.create(new Game({id:"abc", username: "anna"}, [{ id:"ghi", username: "mike" }], "Game 2"))
                await gameModel.create(new Game({id:"ghi", username: "mike" }, [{ id:"def", username: "jon" }], "Game 3"))
            })

            test('game are deleted correctly', async () => {
                    await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toHaveLength(2)

                    const res = await request(app).delete(`/game`)
                    
                    expect(res.status).toEqual(200)
                    await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toHaveLength(0)
                    await expect(gameModel.find({'game.playerIDs': ['ghi']})).resolves.toHaveLength(1)
            })
        })
    })

    describe('endpoint: /game/:gameID', () => {
        describe('get: get particular game for user', () => {

            test('game are returned correctly', async () => {
                const res = await request(app).get(`/game/${gameID}`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveProperty('_id')
                expect(res.body).toHaveProperty('game', game)
            })

            test('get error becouse of wrong gameID', async () => {
                const res = await request(app).get(`/game/622cd907f6026dbf7cad27ef`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveLength(0)
            })

            test('get error becouse of wrong gameID', async () => {
                const res = await request(app).get(`/game/123`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveProperty("message", 'gameID cannot be valid')
            })
        })

        describe('post: play the game', () => {
            describe('roll dicess', () => {
                test('first time', async () => {
                    const res = await request(app).post(`/game/${gameID}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
                    const db_game = await gameModel.findOne({ 'game.playerIDs': [currentPlayer], _id: gameID})

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

                test('by wrong player', async () => {
                    const wrongCurrentPlayer = currentPlayer === "abc" ? "def" : "abc"

                    const res = await request(app).post(`/${wrongCurrentPlayer}/game/${gameID}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')

                    expect(res.status).toEqual(200)
                    expect(res.body).toHaveProperty("level", 'warning')
                    expect(res.body).toHaveProperty("message", `This is turn of user: ${currentPlayer}`)
                    await expect(gameModel.findOne({ 'game.playerIDs': [currentPlayer],_id: gameID})).resolves.toHaveProperty('game', db_game.game)
                })

                test('get error if game does not exist', async () => {
                    const res = await request(app).post(`/game/622cd907f6026dbf7cad27ef`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
                    expect(res.status).toEqual(200)
                    // expect(res.body).toHaveProperty("message", '') // get errorif game doesn't exist
                })
            })

            describe('save figure', () => {

                beforeEach(async function () {
                    game = await makeMove(game, currentPlayer, { "numbersToChange": ["0", "1"]}, undefined)
                    await gameModel.findByIdAndUpdate(gameID, {game: game}, {new: true})
                })

                test('correctly', async () => {
                    const chosenFigure = 'full'
                    
                    const res = await request(app).post(`/game/${gameID}`).send({ "chosenFigure": chosenFigure}).set('Accept', 'application/json')
                    
                    const db_game = await gameModel.findOne({ 'game.playerIDs': [currentPlayer], _id: gameID})
                    expect(res.status).toEqual(200)
                    expect(res.body.numberOfRoll).toEqual(0)
                    expect(res.body).toEqual(db_game.game)
                    expect(res.body.players[currentPlayer].table[chosenFigure]).not.toBeNull()
                })

                test('get error if chosenFigure has wrong value', async () => {
                    const chosenFigure = 1

                    const res = await request(app).post(`/game/${gameID}`).send({ "chosenFigure": chosenFigure}).set('Accept', 'application/json')
                    expect(res.body).toHaveProperty("message", "chosenFigure should be a string")
                })

                test('get error if figure is saved', async () => {
                    const chosenFigure = "full"
                    game.players[currentPlayer].table[chosenFigure] = 0
                    await gameModel.findByIdAndUpdate(gameID, {game: game}, {new: true})

                    const res = await request(app).post(`/game/${gameID}`).send({ "chosenFigure": chosenFigure}).set('Accept', 'application/json')
                    
                    expect(res.body).toHaveProperty("message", "Figure already chosen")
                })
            })

            test('get error if numbersToChange and chosenFigure is undefined', async () => {

                const res = await request(app).post(`/game/${gameID}`).send({}).set('Accept', 'application/json')
                
                expect(res.body).toHaveProperty("message", "Either numbersToChange or chosenFigure should be defined")
            })
        })

        describe('delete: particular game', () => {
            beforeEach(async function () {
                await gameModel.deleteMany({'game.playerIDs': ["ghi"]})
                await gameModel.create(new Game(currentUser, [{ id:"ghi", username: "mike" }], "Game 2"))
                await gameModel.create(new Game({ id:"ghi", username: "mike" }, [{ id:"def", username: "jon" }], "Game 3"))
            })

            test('game are deleted correctly', async () => {

                await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toHaveLength(2)
                await expect(gameModel.findOne({ 'game.playerIDs': [currentPlayer], _id: gameID})).resolves.toBeTruthy()

                const res = await request(app).delete(`/game/${gameID}`)
                
                expect(res.status).toEqual(200)
                await expect(gameModel.findOne({ 'game.playerIDs': [currentPlayer], _id: gameID})).resolves.toBeNull()
                await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toHaveLength(1)
                await expect(gameModel.find({'game.playerIDs': ["ghi"]})).resolves.toHaveLength(2)
            })
        })
    })
})