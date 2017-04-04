const server = require('http').createServer()
const io = require('socket.io')(server)

const utils = require('./utils')

let playerId = 1
const players = {}
const maxPlayers = 5

let undeadId = 1
let undeads = {}
const maxUndeads = 10
const directions = ['left', 'right']

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

  let currentPlayerId;

  socket.on('join', () => {
    currentPlayerId = playerId
    playerId++

    console.log('join with currentPlayerId:', currentPlayerId)

    if (currentPlayerId < maxPlayers) {
      const hero = {
        id: currentPlayerId,
        x: utils.playerPosition(),
        health: 100,
        color: utils.playerColor()
      }

      socket.emit('heroCreated', { hero, players, undeads })

      players[currentPlayerId] = hero
      socket.broadcast.emit('playerCreated', players)

      console.log(players)
    }

    // setInterval(() => loop(), 300)
    // setInterval(() => loop(), 2000)
  })

  socket.on('disconnect', () => {
    console.log('disconnect')
    console.log('currentPlayerId:', currentPlayerId)

    delete players[currentPlayerId]

    socket.broadcast.emit('quit', players)
    console.log(players)
  })

  socket.on('moveLeft', ({ id, x }) => {
    const hero = players[id]
    hero.x -= 3

    socket.emit('moved', hero.x)
    io.emit('playerMoved', players)
  })

  socket.on('moveRight', ({ id, x }) => {
    const hero = players[id]
    hero.x += 3

    socket.emit('moved', hero.x)
    io.emit('playerMoved', players)
  })
})

server.listen(1337)
