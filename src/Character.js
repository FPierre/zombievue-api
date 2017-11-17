module.exports = class Character {
  constructor (id, direction, x, state) {
    this.id = id
    this.direction = direction
    this.x = x
    this.state = state
    this.health = 100
  }
}
