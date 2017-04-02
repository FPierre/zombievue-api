const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const max_players = 3
const max_undeads = 10
const players = []
let undeads = []
const directions = ['left', 'right']

function randomXPosition () {
  return Math.floor((Math.random() * 800) + 1)
}

function randomColor () {
  return '#'+Math.floor(Math.random() * 16777215).toString(16)
}

function loop () {
  // 1 chance in 50
  if (Math.floor(Math.random() * 2) === 0) {
    // 1 chance in 2
    const direction = directions[Math.floor(Math.random() * 2)]
    const xPosition = direction === 'left' ? 0 : 800

    undeads.push({ direction: direction, x: xPosition, color: '#cc0000' })

    console.log('undeadCreated ', undeads)

    io.emit('undeadCreated', undeads)
  }

  if (undeads.length > 0) {
    undeads = undeads.map((undead) => {
      const x = undead.x
      let newXPosition = x + 3

      if (undead.direction === 'right') {
        newXPosition = x - 3
      }

      undead.x = newXPosition

      return undead
    })

    io.emit('undeadsMoved', undeads)
  }
}

io.on('connection', function (socket) {
  console.log('connection')

  socket.on('join', function () {
    console.log('join')

    const player = { name: 'Player 1', x: randomXPosition(), color: randomColor() }

    players.push(player)

    console.log(players)

    io.emit('join', { players: players, player: player, undeads: undeads })

    // setInterval(() => loop(), 300)
    setInterval(() => loop(), 2000)
  })

  socket.on('disconnect', function () {
    console.log('player quit')

    players.splice(1, 1)

    console.log(players)

    socket.broadcast.emit('quit', players)
  })

  socket.on('moveLeft', function (xPosition) {
    console.log('moveLeft, ', xPosition)
    socket.emit('move', xPosition -= 3)
    // socket.broadcast.emit('moved', xPosition -= 3)
  })

  socket.on('moveRight', function (xPosition) {
    console.log('moveRight, ', xPosition)
    socket.emit('move', xPosition += 3)
    // socket.broadcast.emit('moved', xPosition += 3)
  })
})

server.listen(1337)
