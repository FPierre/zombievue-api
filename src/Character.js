module.exports = class Character {
  constructor (id, direction, x, color) {
    this.id = id
    this.direction = direction
    this.x = x
    this.color = color
    this.health = 100
  }
}
