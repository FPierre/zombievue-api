const http = require('http')
const WebSocketServer = require('websocket').server

const { info, warning } = require('./logger')
const { MAX_PLAYERS, players, createPlayer, canCreatePlayer, undeads, createUndead, canCreateUndead, moveUndeads } = require('./game')

const clients = []
let connection = null

const broadcast = (event, data) => {
  for (let i = 0; i < clients.length; i++) {
    clients[i].sendUTF(JSON.stringify({ event, data }))
  }
}

const loop = connection => {
  info('Server: loop')

  if (canCreateUndead()) {
    createUndead()
  }

  moveUndeads()
  broadcast('undeadsMoved', { undeads })
}

const join = () => {
  if (canCreatePlayer()) {
    connection.sendUTF(JSON.stringify({ event: 'joined' }))

    info('Server: create player')
    const playerId = createPlayer()

    connection.sendUTF(JSON.stringify({ event: 'heroCreated', data: { id: playerId, players, undeads } }))
    broadcast('playerCreated', { players })
  } else {
    connection.sendUTF(JSON.stringify({ event: 'maxPlayers', data: { MAX_PLAYERS } }))
  }
}

const moveLeft = ({ id }) => {
  // info('Server: moveLeft', id)

  const player = players.find(p => p.id === id)

  if (player) {
    player.left()
    broadcast('playerMoved', { players })
  }
}

const moveRight = ({ id }) => {
  // info('Server: moveRight', id)

  const player = players.find(p => p.id === id)

  if (player) {
    player.right()
    broadcast('playerMoved', { players })
  }
}

const idle = ({ id }) => {
  const player = players.find(p => p.id === id)

  if (player) {
    player.idle()
    broadcast('playerMoved', { players })
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

      if (players.length) {
        setInterval(() => loop(connection), 1000)
      }

      connection.on('message', message => {
        if (message.type === 'utf8') {
          const { event, data } = JSON.parse(message.utf8Data)
          // info(`Server: received message ${event}`)

          if (event === 'join') {
            join()
          } else if (event === 'moveLeft') {
            moveLeft(data)
          } else if (event === 'moveRight') {
            moveRight(data)
          } else if (event === 'idle') {
            idle(data)
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
// })
