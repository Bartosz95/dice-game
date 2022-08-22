import { Game, makeMove } from '../../services/Game'

describe('Game', function () {

  let game
  let currentPlayer
  let deepCopieGame
  let numbersToChange = undefined

  beforeEach(function () {
    game = new Game({ id:"abc", username: "anna" }, [{ id:"def", username: "jon" }], "Game 3")
    game.numberOfRoll = 1
    deepCopieGame = JSON.parse(JSON.stringify(game))
    currentPlayer = deepCopieGame.currentPlayer;
  })

  describe('#countResult()', function () {

    test('check counting "1" ',async function () {

      const chosenFigure = "1"
      const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
      const result = 3

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -60

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "2" ',async function () {

      const chosenFigure = "2"
      const mug = { "0": 2, "1": 2, "2": 2, "3": 2, "4": 2 }
      const result = 10

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -53

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    
    test('check counting "3" ',async function () {

      const chosenFigure = "3"
      const mug = { "0": 3, "1": 2, "2": 2, "3": 2, "4": 2 }
      const result = 3

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -60

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    
    test('check counting "4" ',async function () {

      const chosenFigure = "4"
      const mug = { "0": 4, "1": 4, "2": 4, "3": 2, "4": 2 }
      const result = 12

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -51

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    
    test('check counting "5" ',async function () {
      const chosenFigure = "5"
      const result = 10
      const mug = { "0": 2, "1": 5, "2": 3, "3": 5, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -53

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    
    test('check counting "6" ',async function () {
      const chosenFigure = "6"
      const result = 18
      const mug = { "0": 6, "1": 2, "2": 2, "3": 6, "4": 6 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -45

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    
    test('check counting "3x" ',async function () {
      const chosenFigure = "3x"
      const result = 10
      const mug = { "0": 2, "1": 2, "2": 2, "3": 2, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    
    test('check counting "3x" ',async function () {
      const chosenFigure = "3x"
      const result = 0
      const mug = { "0": 1, "1": 2, "2": 3, "3": 4, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "4x" ',async function () {
      const chosenFigure = "4x"
      const result = 0
      const mug = { "0": 3, "1": 3, "2": 3, "3": 4, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63
      
      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "4x" ',async function () {
      const chosenFigure = "4x"
      const result = 14
      const mug = { "0": 3, "1": 3, "2": 3, "3": 3, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "4x" ',async function () {
      const chosenFigure = "4x"
      const result = 15
      const mug = { "0": 3, "1": 3, "2": 3, "3": 3, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "full" ',async function () {
      const chosenFigure = "full"
      const result = 0
      const mug = { "0": 3, "1": 3, "2": 3, "3": 4, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "full" ',async function () {
      const chosenFigure = "full"
      const result = 25
      const mug = { "0": 3, "1": 3, "2": 3, "3": 2, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "small strit" ',async function () {
      const chosenFigure = "small strit"
      const result = 0
      const mug = { "0": 6, "1": 5, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "small strit" ',async function () {
      const chosenFigure = "small strit"
      const result = 30
      const mug = { "0": 1, "1": 5, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63   

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "big strit" ',async function () {
      const chosenFigure = "big strit"
      const result = 40
      const mug = { "0": 6, "1": 5, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "big strit" ',async function () {
      const chosenFigure = "big strit"
      const result = 0
      const mug = { "0": 1, "1": 4, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "general" ',async function () {
      const chosenFigure = "general"
      const result = 50
      const mug = { "0": 4, "1": 4, "2": 4, "3": 4, "4": 4 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63 

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "general" ',async function () {
      const chosenFigure = "general"
      const result = 0
      const mug = { "0": 1, "1": 1, "2": 1, "3": 1, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63  

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

    test('check counting "general" ',async function () {
      const chosenFigure = "chance"
      const result = 14
      const mug = { "0": 1, "1": 4, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.players[currentPlayer].table[chosenFigure] = result
      deepCopieGame.players[currentPlayer].table['to bonus'] = -63 

      game = await makeMove(game, currentPlayer, numbersToChange, chosenFigure)

      expect(game.players).toEqual(deepCopieGame.players)
    });

  });
});