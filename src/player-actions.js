const { info, warning } = require('./logger')
const { broadcast, emit } = require('./socket-actions')
const { players, undeads, canCreatePlayer, createPlayer, deletePlayer } = require('./game')

module.exports = {
  join: ({ playerType }) => {
    if (canCreatePlayer()) {
      emit('joined')

      info('Server: create player')
      const id = createPlayer(playerType)

      emit('heroCreated', { id, players, undeads })
      broadcast('playerCreated', { players })
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
    broadcast('quit', { players })
  },

  moveLeft: ({ id }) => {
    // info('Server: moveLeft', id)

    const player = players.find(p => p.id === id)

    if (player) {
      player.left()
      broadcast('playerMoved', { players })
    }
  },

  moveRight: ({ id }) => {
    // info('Server: moveRight', id)

    const player = players.find(p => p.id === id)

    if (player) {
      player.right()
      broadcast('playerMoved', { players })
    }
  },

  idle: ({ id }) => {
    const player = players.find(p => p.id === id)

    if (player) {
      player.idle()
      broadcast('playerMoved', { players })
    }
  },

  attack: ({ id }) => {
    const player = players.find(p => p.id === id)

    if (player) {
      player.attack()
      broadcast('playerMoved', { players })
    }
  }
}
