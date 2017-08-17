const Character = require('./Character')

module.exports = class Player extends Character {
  constructor (id) {
    const x = Player.position()

    super(id, 'left', x)
  }

  moveLeft () {
    this.direction = 'left'
    this.x -= 3
  }

  moveRight () {
    this.direction = 'right'
    this.x += 3
  }

  static position () {
    const gameWidth = 800

    return gameWidth / 2
  }
}
