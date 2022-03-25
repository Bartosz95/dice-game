import assert from 'assert'
import { Game, countFigure} from '../libs/Game'

describe('Game', function () {

  let game
  let currentUser
  let deepCopieGame

  beforeEach(function () {
    game = new Game(["abc","def"])
    currentUser = game.currentUser;
    deepCopieGame = JSON.parse(JSON.stringify(game))
  })

  describe('#countFigure()', function () {

    it('check counting "1" ', function () {

      const figure = "1"
      const mug = { "0": 1, "1": 2, "2": 1, "3": 3, "4": 1 }
      const result = 3

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "2" ', function () {

      const figure = "2"
      const mug = { "0": 2, "1": 2, "2": 2, "3": 2, "4": 2 }
      const result = 10

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    
    it('check counting "3" ', function () {

      const figure = "3"
      const mug = { "0": 3, "1": 2, "2": 2, "3": 2, "4": 2 }
      const result = 3

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    
    it('check counting "4" ', function () {

      const figure = "4"
      const mug = { "0": 4, "1": 4, "2": 4, "3": 2, "4": 2 }
      const result = 12

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    
    it('check counting "5" ', function () {
      const figure = "5"
      const result = 10
      const mug = { "0": 2, "1": 5, "2": 3, "3": 5, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    
    it('check counting "6" ', function () {
      const figure = "6"
      const result = 18
      const mug = { "0": 6, "1": 2, "2": 2, "3": 6, "4": 6 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    
    it('check counting "3x" ', function () {
      const figure = "3x"
      const result = 10
      const mug = { "0": 2, "1": 2, "2": 2, "3": 2, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    
    it('check counting "3x" ', function () {
      const figure = "3x"
      const result = 0
      const mug = { "0": 1, "1": 2, "2": 3, "3": 4, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "4x" ', function () {
      const figure = "4x"
      const result = 0
      const mug = { "0": 3, "1": 3, "2": 3, "3": 4, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "4x" ', function () {
      const figure = "4x"
      const result = 14
      const mug = { "0": 3, "1": 3, "2": 3, "3": 3, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "4x" ', function () {
      const figure = "4x"
      const result = 15
      const mug = { "0": 3, "1": 3, "2": 3, "3": 3, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "full" ', function () {
      const figure = "full"
      const result = 0
      const mug = { "0": 3, "1": 3, "2": 3, "3": 4, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "full" ', function () {
      const figure = "full"
      const result = 25
      const mug = { "0": 3, "1": 3, "2": 3, "3": 2, "4": 2 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "small strit" ', function () {
      const figure = "small strit"
      const result = 0
      const mug = { "0": 6, "1": 5, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "small strit" ', function () {
      const figure = "small strit"
      const result = 30
      const mug = { "0": 1, "1": 5, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "big strit" ', function () {
      const figure = "big strit"
      const result = 40
      const mug = { "0": 1, "1": 5, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "big strit" ', function () {
      const figure = "big strit"
      const result = 0
      const mug = { "0": 1, "1": 4, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "general" ', function () {
      const figure = "general"
      const result = 0
      const mug = { "0": 4, "1": 4, "2": 4, "3": 4, "4": 4 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "general" ', function () {
      const figure = "general"
      const result = 0
      const mug = { "0": 1, "1": 1, "2": 1, "3": 1, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

    it('check counting "general" ', function () {
      const figure = "chance"
      const result = 14
      const mug = { "0": 1, "1": 4, "2": 4, "3": 2, "4": 3 }

      game.mug = mug
      deepCopieGame.mug = mug
      deepCopieGame.users[currentUser].table[figure] = result    

      countFigure(game, figure)

      assert.deepEqual(game, deepCopieGame)
    });

  });
});