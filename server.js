const server = require('http').createServer()
const io = require('socket.io')(server)
const Game = require('./Game')

const game = new Game()

let heroId = null

function heroConnected () {
  return heroId !== null
}

function loop () {
  // console.log('loop')

  game.createUndead()
  io.emit('undeadCreated', game.undeads)

  game.moveUndeads()
  io.emit('undeadsMoved', game.undeads)
}

io.on('connection', socket => {
  console.log('connection')

  socket.on('join', () => {
    console.log('join')

    heroId = game.createPlayer()

    if (heroId) {
      socket.emit('heroCreated', {
        id: heroId,
        players: game.players,
        undeads: game.undeads
      })
      io.emit('playerCreated', game.players)
    } else {
      // socket.emit('maxPlayers', maxPlayers)
    }

    setInterval(loop, 2000)
  })

  socket.on('disconnect', () => {
    console.log('disconnect')

    if (heroConnected()) {
      game.deletePlayer(heroId)
      heroId = null

      // Avoid disconnection first scenario
      /*
      if (game.players.length) {
        playerId--
      }
      */

      socket.broadcast.emit('quit', game.players)
    }
  })

  socket.on('left', id => {
    // console.log('moveLeft, id:', id)

    const hero = game.findPlayer(id)

    if (hero) {
      hero.left()
      io.emit('playerMoved', game.players)
    }
  })

  socket.on('right', id => {
    // console.log('moveRight, id:', id)

    const hero = game.findPlayer(id)

    if (hero) {
      hero.right()
      io.emit('playerMoved', game.players)
    }
  })

  socket.on('idle', id => {
    // console.log('idle, id:', id)

    const hero = game.findPlayer(id)

    if (hero) {
      hero.idle()
      io.emit('playerMoved', game.players)
    }
  })

  socket.on('attack', id => {
    // console.log('attack, id:', id)

    const hero = game.findPlayer(id)

    if (hero) {
      hero.attack()
      io.emit('playerMoved', game.players)
    }
  })
})

server.listen(1337)
