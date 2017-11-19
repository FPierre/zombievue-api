const Character = require('./Character')

module.exports = class Player extends Character {
  constructor (id) {
    super(id, 'left', 'idle', Player.position())
  }

  left () {
    this.direction = 'left'
    this.state = 'walk'
    this.x -= 3
  }

  right () {
    this.direction = 'right'
    this.state = 'walk'
    this.x += 3
  }

  idle () {
    this.state = 'idle'
  }

  // attack () {
  //   this.state = 'attack'
  // }

  static position () {
    const gameWidth = 800

    return gameWidth / 2
  }
}
