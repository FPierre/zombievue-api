const Player = require('./Player')
const Undead = require('./Undead')
const { playerColor, playerPosition } = require('./utils')

let playerId = 1
let currentPlayerId = null
const players = []

let undeadId = 1
let undeads = []
const MAX_UNDEADS = 2
const MAX_PLAYERS = 2

const existingUndeads = () => undeads.length > 0

module.exports = {
  players,
  undeads,
  MAX_PLAYERS,
  canCreatePlayer: () => players.length < MAX_PLAYERS,

  createPlayer: type => {
    players.push(new Player(playerId, type))
    currentPlayerId = playerId
    playerId++

    return currentPlayerId
  },

  deletePlayer: () => {
    const currentPlayer = players.find(p => p.id === currentPlayerId)
    delete currentPlayer

    currentPlayerId = null
  },

  heroConnected: () => currentPlayerId !== null,

  canCreateUndead: () => {
    // one in fifty
    const random = Math.floor(Math.random() * 2)

    return undeads.length < MAX_UNDEADS && random === 0
  },

  createUndead: () => {
    undeads.push(new Undead(undeadId))
    undeadId++
  },

  moveUndeads: () => {
    if (existingUndeads()) {
      undeads.map(undead => {
        undead.x = undead.direction === 'right' ? undead.x - 3 : undead.x + 3
      })
    }
  }
}
