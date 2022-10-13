import request from "supertest"
const https = require('https');
import jwt_decode from "jwt-decode";
import gameModel from "../models/gameModel"
import { Game , makeMove} from '../services/Game'
import app from '../app'
import { response } from "express";

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
        token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJKRzg0VXRqTmVnc0txSzQycTVyT1FMc2NOVFl3ck43aDUxNHRIT2YydFAwIn0.eyJleHAiOjE2NjEzMzU0NDksImlhdCI6MTY2MTMzNTE0OSwianRpIjoiZWM5ZDNlZmYtMjlhNi00NmRkLWFlMTQtMmJiYTIyMTVlNWNmIiwiaXNzIjoiaHR0cHM6Ly9kaWNlLWdhbWUvYXV0aC9yZWFsbXMvZGljZS1nYW1lIiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6ImFmODNmZWM5LTVmN2QtNDA2Zi04ZTFmLTBhZWIxOTAxNzE4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImRpY2UtZ2FtZSIsInNlc3Npb25fc3RhdGUiOiI4MTMzODIzZS1jN2Y1LTQ2ZmQtODNkMC1iNTJkMjE0ZjNiMDYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIiwiZGVmYXVsdC1yb2xlcy1ib2xvIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXVzZXJzIiwicXVlcnktZ3JvdXBzIiwicXVlcnktdXNlcnMiXX0sImRpY2UtZ2FtZSI6eyJyb2xlcyI6WyJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJzaWQiOiI4MTMzODIzZS1jN2Y1LTQ2ZmQtODNkMC1iNTJkMjE0ZjNiMDYiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InRvbSIsImdpdmVuX25hbWUiOiIiLCJmYW1pbHlfbmFtZSI6IiJ9.X-sgJgb5uxIDV5QpFZCbunwcSYyATT5-VcujRr4W2c498plyoF_s9I49PSWKEWA_jJbS4LSGV7KDCByBguQig8g4x3z2kQ3clsCxzu3pxSN6DiccbWcQyn5CA3M-LnccKBV3-a0AEIDUkdynE95g1nJiTdbRPHqNcgFGoKVy1l6Y_FKg_I2ZPCxSX9bNlV1yitu_uft2fpQuCb9ds6E6Qt4zcSKG_MRDC4eK2BdhUcVZAdUZnffM59huJ8gRrHhAVbHN1QfxXcU7d6L9geSD2crwh5tHKYbeCDb9eUWMd7ptCiVvDl74NqHH6fRllqAWMOAMk-D9yuXed48NuetnPg"
        const decodedToken = jwt_decode(token)
        currentUser = { id: decodedToken.sub, username: decodedToken.preferred_username }
    })

    beforeEach(async function () {
        await gameModel.deleteMany({})
        await gameModel.deleteMany({'game.playerIDs': [currentUser.id]})
        await gameModel.deleteMany({'game.playerIDs': ["def"]})
        await gameModel.deleteMany({'game.playerIDs': ["ghi"]})
        await gameModel.deleteMany({'game.playerIDs': ["xyz"]})
        game = new Game(currentUser, [{ id:"def", username: "jon" }], "Game 1")
        deepCopieGame = JSON.parse(JSON.stringify(game))
        currentPlayer = currentUser.id
        db_game = await gameModel.create({game})
        gameID = db_game._id.toString()
    })
       

    describe("endpoint: /game", () => {
        describe("get: get all games for user", () => {
            test('games are return correctly', async () => {
                const game2 = new Game(currentUser, [{ id: "ghi", username: "mike"}], "Game 2")
                const game3 = new Game({ id: "ghi", username: "mike"}, [], "Game 3")
                await gameModel.create({ game: game2 })
                await gameModel.create({ game: game3 })
                const res = await request(app).get(`/game`).set('Authorization', `Bearer ${token}`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveLength(2)
                res.body.forEach(game => {
                    expect(game).toHaveProperty('players')
                    expect(game.players).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                _id: currentPlayer
                            })
                        ])
                    );
                })
            })

            test('User has not any game', async () => {
                await gameModel.deleteMany({'game.playerIDs': [currentPlayer]})
                const res = await request(app).get(`/game`).set('Authorization', `Bearer ${token}`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveLength(0)
                expect(res).not.toHaveProperty('level')
                
            })
        })

        describe("post: create game", () => {
            test('Game is created correctly', async () => {
                const payload = { users: [{ id: 'xyz', username: 'tom' }], name: "Game 4" }
                const res = await request(app).post(`/game`).set('Authorization', `Bearer ${token}`).send(payload).set('Accept', 'application/json')
                expect(res.status).toEqual(201)
                expect(res.body).toHaveProperty('_id')
                expect(res.body).toHaveProperty('currentPlayer')
                expect(res.body).toHaveProperty('playerIDs')
                expect(res.body.playerIDs).toEqual(expect.arrayContaining([currentPlayer, "xyz"]));
                
            })

            test('Add request owner to game', async () => {
                const payload = { users: [ currentUser, { id: 'xyz', username: 'tom' }], name: "Game 4" }
                const res = await request(app).post(`/game`).send(payload).set('Authorization', `Bearer ${token}`).send(payload).set('Accept', 'application/json')
                expect(res.status).toEqual(201)
                expect(res.body).toHaveProperty('_id')
                expect(res.body).toHaveProperty('currentPlayer')
                expect(res.body).toHaveProperty('playerIDs')
                expect(res.body.playerIDs).toEqual(expect.arrayContaining([currentPlayer, "xyz"]));
                expect(res.body.playerIDs).toHaveLength(2)
            })

            test('return error if users is not a Array', async () => {
                const payload = { users: { id: 'xyz', username: 'tom' }, name: "Game 4" }
                const res = await request(app).post(`/game`).send(payload).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
                expect(res.body).toHaveProperty('message', 'users should be a Array')
            })

            test('Every user should contain id and username', async () => {
                const payload = { users: [ { id: 'xyz', username: 'tom' }, 1], name: "Game 4" }
                const res = await request(app).post(`/game`).set('Authorization', `Bearer ${token}`).send(payload).set('Accept', 'application/json')
                expect(res.body).toHaveProperty('message', 'Every user should contain id and username')
            })

            test('Every user id should be a string', async () => {
                const payload = { users: [{ id: 1, username: 'tom' }], name: "Game 4" }
                const res = await request(app).post(`/game`).set('Authorization', `Bearer ${token}`).send(payload).set('Accept', 'application/json')
                expect(res.body).toHaveProperty('message', 'Every user id should be a string')
            })

            test('Every user username should be a string', async () => {
                const payload = { users: [ { id: 'xyz', username: 1 }], name: "Game 4" }
                const res = await request(app).post(`/game`).set('Authorization', `Bearer ${token}`).send(payload).set('Accept', 'application/json')
                expect(res.body).toHaveProperty('message', 'Every user username should be a string')
            })
        })

        describe('delete: delete all game for user', () => {
            beforeEach(async function () {
                await gameModel.deleteMany({})
                const game4 = new Game(currentUser, [{id:"abc", username: "anna"}, { id:"ghi", username: "mike" }], "Game 4")
                const game5 = new Game({id:"ghi", username: "mike" }, [currentUser, { id:"def", username: "jon" }], "Game 5")
                const game6 = new Game({id:"ghi", username: "mike" }, [{ id:"def", username: "jon" }], "Game 5")
                await gameModel.create({ game: game4 })
                await gameModel.create({ game: game5 })
                await gameModel.create({ game: game6 })
            }) 

            test('games are deleted correctly', async () => {
                    await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toHaveLength(2)

                    const res = await request(app).delete(`/game`).set('Authorization', `Bearer ${token}`)
    
                    expect(res.status).toEqual(200)
                    await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toHaveLength(0)
                    await expect(gameModel.find({'game.playerIDs': ['ghi']})).resolves.toHaveLength(1)
            })
        })
    })

    describe('endpoint: /game/:gameID', () => {
        describe('get: particular game for user', () => {

            test('game are returned correctly', async () => {
                const res = await request(app).get(`/game/${gameID}`).set('Authorization', `Bearer ${token}`)
                expect(res.status).toEqual(200)
                expect(res.body).toHaveProperty('_id')
                const gameChecked = JSON.parse(JSON.stringify(game))
                gameChecked.players[currentPlayer].checked = true
                gameChecked.isYourTurn = true
                expect(res.body).toHaveProperty('game', gameChecked)
            })

            test('get error becouse of wrong gameID', async () => {
                const res = await request(app).get(`/game/622cd907f6026dbf7cad27ef`).set('Authorization', `Bearer ${token}`)
                expect(res.status).toEqual(400)
                expect(res.body).toHaveProperty("message", 'Wrong gameID')
            })

            test('gameID cannot be valid', async () => {
                const res = await request(app).get(`/game/123`).set('Authorization', `Bearer ${token}`)
                expect(res.status).toEqual(400)
                expect(res.body).toHaveProperty("message", 'gameID cannot be valid')
            })
        })

        describe('post: play the game', () => {
            describe('roll dicess', () => {
                test('first time', async () => {
                    const res = await request(app).post(`/game/${gameID}`).send({ "numbersToChange": ["0", "1"]}).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
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
                    const game4 = new Game({ id:"ghi", username: "mike" }, [currentUser], "Game 4")
                    const db_game4 = await gameModel.create({ game: game4 })
                    const gameID4 =  db_game4._id.toString()
                    const res = await request(app).post(`/game/${gameID4}`).set('Authorization', `Bearer ${token}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
                    expect(res.status).toEqual(400)
                    expect(res.body).toHaveProperty("level", 'warning')
                    expect(res.body).toHaveProperty("message", `This is turn of user: ghi`)
                })

                test('get error if game does not exist', async () => {
                    const res = await request(app).post(`/game/622cd907f6026dbf7cad27ef`).set('Authorization', `Bearer ${token}`).send({ "numbersToChange": ["0", "1"]}).set('Accept', 'application/json')
                    expect(res.status).toEqual(504)
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
                    
                    const res = await request(app).post(`/game/${gameID}`).set('Authorization', `Bearer ${token}`).send({ "chosenFigure": chosenFigure}).set('Accept', 'application/json')
                    
                    const db_game = await gameModel.findOne({ 'game.playerIDs': [currentPlayer], _id: gameID})
                    expect(res.status).toEqual(200)
                    expect(res.body.game.numberOfRoll).toEqual(0)
                    expect(res.body.game).toEqual(db_game.game)
                    expect(res.body.game.players[currentPlayer].table[chosenFigure]).not.toBeNull()
                })

                test('get error if chosenFigure has wrong value', async () => {
                    const chosenFigure = 1

                    const res = await request(app).post(`/game/${gameID}`).set('Authorization', `Bearer ${token}`).send({ "chosenFigure": chosenFigure}).set('Accept', 'application/json')
                    expect(res.body).toHaveProperty("message", "chosenFigure should be a string")
                })

                test('get error if figure is saved', async () => {
                    const chosenFigure = "full"
                    game.players[currentPlayer].table[chosenFigure] = 0
                    await gameModel.findByIdAndUpdate(gameID, {game: game}, {new: true})

                    const res = await request(app).post(`/game/${gameID}`).set('Authorization', `Bearer ${token}`).send({ "chosenFigure": chosenFigure}).set('Accept', 'application/json')
                    
                    expect(res.body).toHaveProperty("message", "Figure already chosen")
                })
            })

            test('get error if numbersToChange and chosenFigure is undefined', async () => {

                const res = await request(app).post(`/game/${gameID}`).set('Authorization', `Bearer ${token}`).send({}).set('Accept', 'application/json')
                
                expect(res.body).toHaveProperty("message", "Either numbersToChange or chosenFigure should be defined")
            })
        })

        describe('delete: particular game', () => {

            beforeEach(async function () {
                await gameModel.deleteMany({'game.playerIDs': ["ghi"]})
                const game2 = new Game(currentUser, [{ id:"ghi", username: "mike" }], "Game 2")
                const game3 = new Game({ id:"ghi", username: "mike" }, [{ id:"def", username: "jon" }], "Game 3")
                await gameModel.create({ game: game2})
                await gameModel.create({ game: game3})
            })

            test('particular game are deleted correctly', async () => {

                await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toHaveLength(2)
                await expect(gameModel.findOne({ 'game.playerIDs': [currentPlayer], _id: gameID})).resolves.toBeTruthy()

                const res = await request(app).delete(`/game/${gameID}`).set('Authorization', `Bearer ${token}`)
                
                expect(res.status).toEqual(202)
                await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toHaveLength(1)
                await expect(gameModel.find({'game.playerIDs': [currentPlayer]})).resolves.toEqual(
                    expect.arrayContaining([
                        expect.not.objectContaining({
                            _id: gameID
                        })
                    ])
                );
                await expect(gameModel.find({'game.playerIDs': ["ghi"]})).resolves.toHaveLength(2)
            })
        })
    })
})