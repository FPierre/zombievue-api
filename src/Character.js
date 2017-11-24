module.exports = class Character {
  constructor (id, direction, state, type, x) {
    this.id = id
    this.direction = direction
    this.health = 100
    this.state = state
    this.type = type
    this.x = x
  }
}
