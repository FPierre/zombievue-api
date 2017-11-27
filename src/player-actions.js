const { info, warning } = require('./logger')
const { broadcast, emit } = require('./socket-actions')
const { canCreatePlayer, createPlayer, deletePlayer } = require('./game')

module.exports = {
  join: ({ playerType }) => {
    if (canCreatePlayer()) {
      emit('joined')

      info('Server: create player')
      const id = createPlayer(playerType)

      emit('heroCreated', { id, players: global.players, undeads: global.undeads })
      broadcast('playerCreated', { players: global.players })
    } else {
      emit('maxPlayers')
    }
  },

  quit: ({ id }) => {
    deletePlayer()
    // clients.splice(index, 1)

    // Avoid disconnection first scenario
    // if (game.players.length) {
    //   playerId--
    // }
    broadcast('quit', { players: global.players })
  },

  moveLeft: ({ id }) => {
    // info('Server: moveLeft', id)

    const player = global.players.find(p => p.id === id)

    if (player) {
      player.left()
      broadcast('playerMoved', { players: global.players })
    }
  },

  moveRight: ({ id }) => {
    // info('Server: moveRight', id)

    const player = global.players.find(p => p.id === id)

    if (player) {
      player.right()
      broadcast('playerMoved', { players: global.players })
    }
  },

  idle: ({ id }) => {
    const player = global.players.find(p => p.id === id)

    if (player) {
      player.idle()
      broadcast('playerMoved', { players: global.players })
    }
  },

  attack: ({ id }) => {
    const player = global.players.find(p => p.id === id)

    if (player) {
      player.attack()
      broadcast('playerMoved', { players: global.players })
    }
  }
}
