const Character = require('./Character')

module.exports = class Player extends Character {
  constructor (id) {
    const x = Player.position()

    super(id, 'left', x, 'idle')
  }

  left () {
    this.direction = 'left'
    this.x -= 3
    this.state = 'walk'
  }

  right () {
    this.direction = 'right'
    this.x += 3
    this.state = 'walk'
  }

  idle () {
    this.state = 'idle'
  }

  attack () {
    this.state = 'attack'
  }

  static position () {
    const gameWidth = 800

    return gameWidth / 2
  }
}
