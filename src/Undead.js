const Character = require('./Character')

module.exports = class Undead extends Character {
  constructor (id) {
    const direction = Undead.direction()
    const x = Undead.position(direction)

    super(id, direction, x, '#cc0000')
  }

  static max () {
    return 10
  }

  static directions () {
    return ['left', 'right']
  }

  static direction () {
    // 1 chance in 2
    return Undead.directions()[Math.floor(Math.random() * 2)]
  }

  static position (direction) {
    const gameWidth = 800

    return direction === 'left' ? 0 : gameWidth
  }
}
