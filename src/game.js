const Player = require('./models/Player')
const Undead = require('./models/Undead')
const { playerColor, playerPosition } = require('./utils')

const MAX_UNDEADS = 2
const MAX_PLAYERS = 2

let playerId = 1
let undeadId = 1
let currentPlayerId = null

const existingUndeads = () => global.undeads.length > 0
const canCreatePlayer = () => global.players.length < MAX_PLAYERS
const heroConnected = () => currentPlayerId !== null

const createPlayer = type => {
  global.players.push(new Player(playerId, type))
  currentPlayerId = playerId
  playerId++

  return currentPlayerId
}

const deletePlayer = () => {
  if (heroConnected()) {
    const currentPlayer = global.players.find(p => p.id === currentPlayerId)
    delete currentPlayer
    currentPlayerId = null
  }
}

const canCreateUndead = () => {
  // one in fifty
  const random = Math.floor(Math.random() * 2)

  return global.undeads.length < MAX_UNDEADS && random === 0
}

const createUndead = () => {
  global.undeads.push(new Undead(undeadId))
  undeadId++
}

const moveUndeads = () => {
  if (existingUndeads()) {
    global.undeads.map(undead => {
      undead.x = undead.direction === 'right' ? undead.x - 3 : undead.x + 3
    })
  }
}

module.exports = {
  MAX_PLAYERS,
  canCreatePlayer,
  canCreateUndead,
  createPlayer,
  createUndead,
  deletePlayer,
  moveUndeads
}
