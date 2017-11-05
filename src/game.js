const Undead = require('./Undead')
const utils = require('./utils')

let playerId = 1
let currentPlayerId = null
const players = []
const maxPlayers = 5

let undeadId = 1
let undeads = []
const maxUndeads = 10

const canCreateUndead = () => {
  // one in fifty
  const random = Math.floor(Math.random() * 2)

  return undeads.length < 1 && random === 0
}

const existingUndeads = () => {
  return undeads.length > 0
}

module.exports = {
  players: players,
  undeads: undeads,
  canCreatePlayer: () => {
    return players.length < maxPlayers
  },

  createPlayer: () => {
    players.push({
      id: playerId,
      x: utils.playerPosition(),
      health: 100,
      color: utils.playerColor()
    })

    currentPlayerId = playerId
    playerId++

    return currentPlayerId
  },

  deletePlayer: () => {
    const currentPlayer = players.find(p => p.id === currentPlayerId)
    delete currentPlayer

    currentPlayerId = null
  },

  heroConnected: () => {
    return currentPlayerId !== null
  },

  createUndead: () => {
    if (canCreateUndead()) {
      undeads.push(new Undead(undeadId))
      undeadId++
    }
  },

  moveUndeads: () => {
    if (existingUndeads()) {
      undeads.map(undead => {
        undead.x = undead.direction === 'right' ? undead.x - 3 : undead.x + 3
      })
    }
  }
}
