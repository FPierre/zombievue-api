const Character = require('./Character')

module.exports = class Undead extends Character {
  constructor (id) {
    const direction = Undead.direction()
    const x = Undead.position(direction)

    super(id, direction, 'walk', x)
  }

  static direction () {
    // 1 chance of 2
    return ['left', 'right'][Math.floor(Math.random() * 2)]
  }

  static position (direction) {
    const gameWidth = 800

    return direction === 'left' ? 0 : gameWidth
  }
}
