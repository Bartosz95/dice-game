import request from "supertest"
import createGameRouter from '../routers/gameRouter';




// const dbGameWrapper_test = {
//   find: jest.fn(),
//   getAllGames: jest.fn(),
//   getParticularGame: jest.fn(),
//   createGame: jest.fn(),
//   updateGame: jest.fn(),
//   deleteAllGames: jest.fn(),
//   deleteParticularGames: jest.fn()
// }

// const app = createGameRouter(dbGameWrapper_test)
// const userID = 1

// describe("POST /api/v1/user/1/game", () => {

//     beforeEach(() => {
//       dbGameWrapper_test.find.mockReset()
//       dbGameWrapper_test.getAllGames.mockReset(),
//       dbGameWrapper_test.getParticularGame.mockReset(),
//       dbGameWrapper_test.createGame.mockReset(),
//       dbGameWrapper_test.updateGame.mockReset(),
//       dbGameWrapper_test.deleteAllGames.mockReset(),
//       dbGameWrapper_test.deleteParticularGames.mockReset()
//     })

//   describe("user create game", () => {
//     test("should save the game with 2 players in the database", async () => {
    
//       const body = {
//         userIDs: ["1","2"]
//       }

//       const response = await request(app).post(`/api/v1/user/${userID}/game`).send(body)
//       //console.log(createUser.mock.calls[0])
//       //expect(createUser.mock.calls[0][0]).toBe(body.username)
//       //expect(createUser.mock.calls[0][1]).toBe(body.password)
//     })
//   })

// })