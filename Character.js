module.exports = class Character {
  constructor (id, direction, x, state) {
    this.id = id
    this.direction = direction
    this.x = x
    this.health = 100
    this.state = null
  }
}
