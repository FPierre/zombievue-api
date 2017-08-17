const Player = require('./Player')
const Undead = require('./Undead')

module.exports = class Game {
  constructor () {
    this.playerId = 1
    this.undeadId = 1

    this.maxPlayers = 2
    this.maxUndeads = 10

    this.players = []
    this.undeads = []
  }

  findPlayer (id) {
    console.log(this.players)

    return this.players.find(p => p.id === id)
  }

  canCreatePlayer () {
    return this.players.length < this.maxPlayers
  }

  createPlayer () {
    console.log('createPlayer')

    if (this.canCreatePlayer()) {
      const player = new Player(this.playerId)

      this.players.push(player)
      this.playerId++

      return player.id
    }

    return false
  }

  deletePlayer (playerId) {
    console.log('deletePlayer')

    this.players = this.players.filter(p => p.id !== playerId)
    // delete this.players.find(p => p.id === playerId)
    // currentPlayerId = null
  }

  canCreateUndead () {
    return this.undeads.length < this.maxUndeads
  }

  createUndead () {
    console.log('createUndead')

    if (this.canCreateUndead() && Math.floor(Math.random() * 2) === 0) {
      this.undeads.push(new Undead(this.undeadId))
      this.undeadId++
    }
  }

  moveUndeads () {
    // console.log('moveUndeads')

    if (this.undeads.length) {
      this.undeads.map(undead => {
        undead.x = undead.direction === 'right' ? undead.x - 3 : undead.x + 3
      })
    }
  }
}
