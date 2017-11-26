const { broadcast, emit } = require('./socket-actions')
const { canCreatePlayer, createPlayer, players, undeads } = require('./game')
const { info, warning } = require('./logger')

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
