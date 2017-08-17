const Character = require('./Character')

module.exports = class Player extends Character {
  constructor (id) {
    const x = Player.position()

    super(id, 'left', x, 'idle')
  }

  moveLeft () {
    this.direction = 'left'
    this.x -= 3
    this.state = 'walk'
  }

  moveRight () {
    this.direction = 'right'
    this.x += 3
    this.state = 'walk'
  }

  idle () {
    this.state = 'idle'
  }

  static position () {
    const gameWidth = 800

    return gameWidth / 2
  }
}
