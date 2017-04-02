const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const utils = require('./utils')

// TODO: implentation
const max_players = 3
const max_undeads = 10

let hero = null
const players = []
let undeads = []

const directions = ['left', 'right']

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

    const newHero = {
      name: 'Player 1',
      x: utils.randomXPosition(),
      color: utils.randomColor()
    }

    hero = newHero
    players.push(newHero)

    // Broadcast to hero only
    socket.emit('heroCreated', { hero, players, undeads })
    // Broadcast to all players but not hero
    socket.broadcast.emit('playerCreated', players)

    // setInterval(() => loop(), 300)
    // setInterval(() => loop(), 2000)
  })

  socket.on('disconnect', function () {
    // console.log('player quit')

    players.splice(1, 1)

    // console.log(players)

    socket.broadcast.emit('quit', players)
  })

  socket.on('moveLeft', function (xPosition) {
    // console.log('moveLeft, ', xPosition)
    socket.emit('move', xPosition -= 3)
    io.emit('playerMoved', players)
  })

  socket.on('moveRight', function (xPosition) {
    // console.log('moveRight, ', xPosition)
    socket.emit('move', xPosition += 3)
    io.emit('playerMoved', players)
  })
})

server.listen(1337)
