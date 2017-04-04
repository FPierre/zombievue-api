const server = require('http').createServer()
const io = require('socket.io')(server)

const utils = require('./utils')

const gameWidth = 800

let playerId = 1
const players = {}
const maxPlayers = 5

let undeadId = 1
let undeads = new Map()
const maxUndeads = 10
const directions = ['left', 'right']

function loop () {
  // 1 chance in 50
  if (undeadId < maxUndeads && Math.floor(Math.random() * 2) === 0) {
    undeadId++

    // 1 chance in 2
    const direction = directions[Math.floor(Math.random() * 2)]
    const position = (direction === 'left') ? 0 : gameWidth

    undeads.set(undeadId, { direction: direction, x: position, color: '#cc0000' })

    io.emit('undeadCreated', undeads)
  }

  if (undeads.length > 0) {
    undeads = [...undeads].map(undead => {
      const x = undead.x
      undead.x = undead.direction === 'right' ? (x - 3) : (x + 3)
    })

    io.emit('undeadsMoved', undeads)
  }
}

io.on('connection', (socket) => {
  console.log('connection')

  socket.on('join', () => {
    console.log('join')

    if (playerId < maxPlayers) {
      let heroId = playerId++

      const hero = {
        id: heroId,
        x: utils.playerPosition(),
        color: utils.playerColor()
      }

      players[heroId] = hero

      // Broadcast to hero only
      socket.emit('heroCreated', { hero, players, undeads })
      // Broadcast to all players but not hero
      socket.broadcast.emit('playerCreated', players)
    }

    // setInterval(() => loop(), 300)
    // setInterval(() => loop(), 2000)
  })

  socket.on('disconnect', () => {
    // console.log('player quit')

    // players.splice(1, 1)

    socket.broadcast.emit('quit', players)
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
