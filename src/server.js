const http = require('http')
const WebSocketServer = require('websocket').server

const { info, warning } = require('./logger')
const { players, createPlayer, canCreatePlayer, undeads, createUndead, moveUndeads, maxPlayers } = require('./game')

const clients = []
let connection = null

const loop = connection => {
  info('Server: loop')

  info('Server: create undead')
  createUndead()

  // io.emit('undeadCreated', undeads)
  for (let i = 0; i < clients.length; i++) {
    clients[i].sendUTF(JSON.stringify({ event: 'undeadCreated', data: { undeads } }))
    // connection.sendUTF(JSON.stringify(undeads))
  }

  info('Server: move undeads')
  moveUndeads()

  // io.emit('undeadsMoved', undeads)
  for (let i = 0; i < clients.length; i++) {
    clients[i].sendUTF(JSON.stringify({ event: 'undeadsMoved', data: { undeads } }))
    // connection.sendUTF(JSON.stringify(undeads))
  }
}

const join = () => {
  if (canCreatePlayer()) {
    connection.sendUTF(JSON.stringify({ event: 'joined' }))

    info('Server: create player')
    const playerId = createPlayer()

    // socket.emit('heroCreated', { id: playerId, undeads })
    connection.sendUTF(JSON.stringify({ event: 'heroCreated', data: { id: playerId, players, undeads } }))

    // io.emit('playerCreated', players)
    for (let i = 0; i < clients.length; i++) {
      clients[i].sendUTF(JSON.stringify({ event: 'playerCreated', data: { players } }))
      // connection.sendUTF(JSON.stringify(undeads))
    }
  } else {
    connection.sendUTF(JSON.stringify({ event: 'maxPlayers', data: { maxPlayers } }))
    // socket.emit('maxPlayers', maxPlayers)
  }
}

const moveLeft = ({ id }) => {
  info('Server: moveLeft', id)

  const player = players.find(p => p.id === id)

  if (player) {
    player.x -= 3

    for (let i = 0; i < clients.length; i++) {
      clients[i].sendUTF(JSON.stringify({ event: 'playerMoved', data: { players } }))
    }
  }
}

const moveRight = ({ id }) => {
  info('Server: moveRight', id)

  const player = players.find(p => p.id === id)

  if (player) {
    player.x += 3

    for (let i = 0; i < clients.length; i++) {
      clients[i].sendUTF(JSON.stringify({ event: 'playerMoved', data: { players } }))
    }
  }
}

module.exports = {
  start: () => {
    const httpServer = http.createServer((request, response) => {
      info(`Server: received request for ${request.url}`)

      response.writeHead(404)
      response.end()
    })

    httpServer.listen(process.env.PORT, () => {
      info(`Server: listening on port ${process.env.PORT}`)
    })

    wsServer = new WebSocketServer({
      httpServer,
      // You should not use autoAcceptConnections for production applications, as it defeats all
      // standard cross-origin protection facilities built into the protocol and the browser.
      // You should *always* verify the connection's origin and decide whether or not to accept it.
      autoAcceptConnections: false
    })

    const originIsAllowed = origin => {
      // put logic here to detect whether the specified origin is allowed.
      return true
    }

    wsServer.on('request', request => {
      const { origin } = request

      if (!originIsAllowed(origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject()
        warning(`Server: connection from origin ${origin} rejected`)

        return
      }

      connection = request.accept('echo-protocol', request.origin)

      // Client index to remove them on 'close' event
      const index = clients.push(connection) - 1

      info('Server: connection accepted')

      // setInterval(() => {
      //   loop(connection)
      // }, 1000)

      connection.on('message', message => {
        if (message.type === 'utf8') {
          const { event, data } = JSON.parse(message.utf8Data)
          info(`Server: received message ${event}`)

          if (event === 'join') {
            join()
          } else if (event === 'moveLeft') {
            moveLeft(data)
          } else if (event === 'moveRight') {
            moveRight(data)
          }

          // connection.sendUTF(message.utf8Data)
        }
      })

      connection.on('close', (reasonCode, description) => {
        // if (userName !== false && userColor !== false) {
          info(`Server: peer ${connection.remoteAddress} disconnected`)
          clients.splice(index, 1)
        // }
      })
    })
  }
}



// const server = require('http').createServer()
// const io = require('socket.io')(server)

// const { players, undeads } = require('./game')
//
// const loop = () => {
//   // console.log('loop')
//
//   info('Create undead')
//   createUndead()
//   io.emit('undeadCreated', undeads)
//
//   info('Move undead')
//   moveUndeads()
//   io.emit('undeadsMoved', undeads)
// }
//
// io.on('connection', socket => {
//   console.log('connection')
//
//   socket.on('join', () => {
//     console.log('join')
//
//     if (canCreatePlayer()) {
//       socket.emit('joined')
//
//       info('Create player')
//       const playerId = createPlayer()
//
//       socket.emit('heroCreated', { id: playerId, undeads })
//       io.emit('playerCreated', players)
//     } else {
//       socket.emit('players', maxPlayers)
//     }
//
//     setInterval(loop, 2000)
//   })
//
//   socket.on('disconnect', () => {
//     warning('disconnect')
//
//     if (heroConnected()) {
//       info('Delete player')
//       deletePlayer()
//
//       // Avoid disconnection first scenario
//       if (players.length) {
//         playerId--
//       }
//
//       socket.broadcast.emit('quit', players)
//     }
//   })
//
//   /*
//   socket.on('moveLeft', id => {
//     console.log('moveLeft, id:', id)
//     players[id].x -= 3
//
//     io.emit('playerMoved', players)
//   })
//
//   socket.on('moveRight', id => {
//     players[id].x += 3
//
//     io.emit('playerMoved', players)
//   })
//   */
// })
//
// server.listen(1337, info('Start to listen on localhost:1337'))
