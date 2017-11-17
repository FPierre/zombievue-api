module.exports = class Character {
  constructor (id, direction, state, x) {
    this.id = id
    this.direction = direction
    this.health = 100
    this.state = state
    this.x = x
  }
}
