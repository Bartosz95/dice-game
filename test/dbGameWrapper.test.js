import { getAllGames, getParticularGame, createGame, updateGame, deleteAllGames, deleteParticularGame } from '../libs/dbGameWrapper'
import { Game, makeMove } from '../libs/Game'

describe('dbGameWrapper', function () {

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

    describe('createGame', function () {

        test("Check if db object has game prop", async () => {
            return await expect(createGame(game)).resolves.toHaveProperty("game", game)
        })

        test("Check if db object has id prop", async () => {
            return await expect(createGame(game)).resolves.toHaveProperty("_id")
        })
    })

    describe('getParticularGame', function () {

        test("Check if db object has game prop", async () => {
            return await expect(getParticularGame(currentPlayer, gameID)).resolves.toHaveProperty("game", game)
        })

        test("Check if db object has id prop", async () => {
            return await expect(getParticularGame(currentPlayer, gameID)).resolves.toHaveProperty("_id", db_game._id)
        })
    })

    describe('getAllGames', function () {

        test("Check if return array", async () => {
            return await expect(getAllGames(currentPlayer)).resolves.toHaveLength(2)
        })

        test("Check if all games in array belong to user", async () => {
            const db_games = await getAllGames(currentPlayer)
            db_games.forEach(db_game => {
                expect(db_game.game.playerIDs).toEqual(expect.arrayContaining([currentPlayer]))
            })
        })
    })

    describe('updateGame', function () {

        test("Check if updated game has game prop", async () => {
            const dicesToChange = ["0", "1", "2"]
            const chosenFigure = undefined
            game = await makeMove(game, currentPlayer, dicesToChange, chosenFigure)
            await expect(updateGame(gameID, game)).resolves.toHaveProperty("game", game)
            await expect(getParticularGame(currentPlayer, gameID)).resolves.toHaveProperty("game", game)
        })

        test("Check if updated game has the same id", async () => {
            const dicesToChange = ["0", "1", "2"]
            const chosenFigure = undefined
            game = await makeMove(game, currentPlayer, dicesToChange, chosenFigure)
            await expect(updateGame(gameID, game)).resolves.toHaveProperty("id", gameID)
        })
        
        test("Check if only one game is updated", async () => {
            const dicesToChange = ["0", "1", "2"]
            const chosenFigure = undefined
            const game2 = new Game(["def","ghi"])
            const game3 = new Game(["abc","ghi"])
            const db_game2 = await createGame(game2)
            const db_game3 = await createGame(game3)

            game = await makeMove(game, currentPlayer, dicesToChange, chosenFigure)
            await updateGame(gameID, game)
            
            await expect(getParticularGame(game2.currentPlayer, db_game2._id.toString())).resolves.toHaveProperty("game", game2)
            await expect(getParticularGame(game3.currentPlayer, db_game3._id.toString())).resolves.toHaveProperty("game", game3)
        })
    })

    describe('getAllGames', function () {
        test("check if all games for particular player are deleted", async () => {
            await createGame(new Game(["abc","def"]))
            await createGame(new Game(["abc","jkl"]))
            await deleteAllGames("abc")
            await expect(getAllGames("ghi")).resolves.toHaveLength(1)
        })
    })

    describe('deleteParticularGame', function () {
        test("check if particular games for particular player is deleted", async () => {
            await createGame(new Game(["def","jkl"]))
            const games = await getAllGames(currentPlayer)

            await expect(getParticularGame(currentPlayer, gameID)).resolves.not.toBeNull()
            
            await deleteParticularGame(currentPlayer, gameID)

            await expect(getAllGames(currentPlayer)).resolves.toHaveLength(games.length - 1)
            await expect(getParticularGame(currentPlayer, gameID)).resolves.toBeNull()
        })
    })
})