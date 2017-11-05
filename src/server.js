const server = require('http').createServer()
const io = require('socket.io')(server)

const Undead = require('./Undead')
const utils = require('./utils')
const { info, warning } = require('./logger')

let playerId = 1
let currentPlayerId = null
const players = {}
const maxPlayers = 5

let undeadId = 1
let undeads = []
const maxUndeads = 10

const oneInFifty = () => {
  return Math.floor(Math.random() * 2) === 0
}

const canCreatePlayer = () => {
  return Object.keys(players).length >= maxPlayers
}

const createPlayer = () => {
  console.log('createPlayer')

  players[playerId] = {
    id: playerId,
    x: utils.playerPosition(),
    health: 100,
    color: utils.playerColor()
  }

  currentPlayerId = playerId
  playerId++
}

const deletePlayer = () => {
  console.log('deletePlayer')

  delete players[currentPlayerId]
  currentPlayerId = null
}

const heroConnected = () => {
  return currentPlayerId !== null
}

const existingUndeads = () => {
  return undeads.length > 0
}

const canCreateUndead = () => {
  return undeads.length < 1 && oneInFifty()
}

const createUndead = () => {
  console.log('createUndead')

  undeads.push(new Undead(undeadId))
  undeadId++
}

const moveUndeads = () => {
  // console.log('moveUndeads')

  undeads.map(undead => {
    undead.x = undead.direction === 'right' ? undead.x - 3 : undead.x + 3
  })
}

const loop = () => {
  // console.log('loop')

  if (canCreateUndead()) {
    createUndead()

    io.emit('undeadCreated', undeads)
  }

  if (existingUndeads()) {
    moveUndeads()
  }

  io.emit('undeadsMoved', undeads)
}

io.on('connection', socket => {
  console.log('connection')

  socket.on('join', () => {
    console.log('join')

    if (!canCreatePlayer()) {
      socket.emit('maxPlayers', maxPlayers)
    } else {
      socket.emit('joined')

      createPlayer()

      socket.emit('heroCreated', { id: playerId, undeads })
      io.emit('playerCreated', players)
    }

    setInterval(loop, 2000)
  })

  socket.on('disconnect', () => {
    console.log('disconnect')

    if (heroConnected()) {
      deletePlayer()

      // Avoid disconnection first scenario
      if (Object.keys(players).length > 0) {
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
