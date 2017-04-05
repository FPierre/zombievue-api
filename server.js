const server = require('http').createServer()
const io = require('socket.io')(server)

const utils = require('./utils')

let playerId = 1
let currentPlayerId = null
const players = {}
const maxPlayers = 5

let undeadId = 1
let undeads = {}
const maxUndeads = 10

function loop () {
  // 1 chance in 50
  if (undeadId < maxUndeads && Math.floor(Math.random() * 2) === 0) {
    const direction = utils.undeadDirection()
    undeads[undeadId] = { direction: direction, x: utils.undeadPosition(direction), color: '#cc0000' }
    undeadId++

    io.emit('undeadCreated', undeads)
  }

  if (undeads.length > 0) {
    undeads.map(undead => {
      const x = undead.x
      undead.x = undead.direction === 'right' ? (x - 3) : (x + 3)
    })

    io.emit('undeadsMoved', undeads)
  }
}

io.on('connection', (socket) => {
  console.log('connection')

  socket.on('join', () => {
    console.log('join, Object.keys(players).length:', Object.keys(players).length)

    if (Object.keys(players).length >= maxPlayers) {
      socket.emit('maxPlayers', maxPlayers)

      return
    }

    players[playerId] = {
      id: playerId,
      x: utils.playerPosition(),
      health: 100,
      color: utils.playerColor()
    }

    currentPlayerId = playerId

    socket.emit('heroCreated', { id: playerId, undeads })
    io.emit('playerCreated', players)

    playerId++

    console.log(players)

    // setInterval(() => loop(), 300)
    // setInterval(() => loop(), 2000)
  })

  socket.on('disconnect', () => {
    console.log('disconnect')

    console.log('currentPlayerId:', currentPlayerId)

    // if (players.length <= maxPlayers) {
    if (currentPlayerId !== null) {
      delete players[currentPlayerId]

      currentPlayerId = null

      // Avoid disconnection first scenario
      if (Object.keys(players).length > 0) {
        playerId--
      }

      socket.broadcast.emit('quit', players)
    }

    console.log(players)
  })

  socket.on('moveLeft', (id) => {
    console.log('moveLeft, id:', id)
    players[id].x -= 3

    io.emit('playerMoved', players)
  })

  socket.on('moveRight', (id) => {
    players[id].x += 3

    io.emit('playerMoved', players)
  })
})

server.listen(1337)
