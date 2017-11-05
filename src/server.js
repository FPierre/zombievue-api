const server = require('http').createServer()
const io = require('socket.io')(server)

const { info, warning } = require('./logger')
const { players, undeads } = require('./game')

const loop = () => {
  // console.log('loop')

  info('Create undead')
  createUndead()
  io.emit('undeadCreated', undeads)

  info('Move undead')
  moveUndeads()
  io.emit('undeadsMoved', undeads)
}

io.on('connection', socket => {
  console.log('connection')

  socket.on('join', () => {
    console.log('join')

    if (canCreatePlayer()) {
      socket.emit('joined')

      info('Create player')
      const playerId = createPlayer()

      socket.emit('heroCreated', { id: playerId, undeads })
      io.emit('playerCreated', players)
    } else {
      socket.emit('maxPlayers', maxPlayers)
    }

    setInterval(loop, 2000)
  })

  socket.on('disconnect', () => {
    warning('disconnect')

    if (heroConnected()) {
      info('Delete player')
      deletePlayer()

      // Avoid disconnection first scenario
      if (players.length) {
        playerId--
      }

      socket.broadcast.emit('quit', players)
    }
  })

  /*
  socket.on('moveLeft', id => {
    console.log('moveLeft, id:', id)
    players[id].x -= 3

    io.emit('playerMoved', players)
  })

  socket.on('moveRight', id => {
    players[id].x += 3

    io.emit('playerMoved', players)
  })
  */
})

server.listen(1337, info('Start to listen on localhost:1337'))
