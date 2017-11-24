const http = require('http')
const WebSocketServer = require('websocket').server

const { info, warning } = require('./logger')
const { heroConnected, players, createPlayer, canCreatePlayer, undeads, createUndead, canCreateUndead, moveUndeads, deletePlayer } = require('./game')

const clients = []
let connection = null

const originIsAllowed = origin => {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

const emit = (event, data) => connection.sendUTF(JSON.stringify({ event, data }))

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

const join = ({ playerType }) => {
  console.log(playerType)
  if (canCreatePlayer()) {
    emit('joined')

    info('Server: create player')
    const id = createPlayer(playerType)

    emit('heroCreated', { id, players, undeads })
    broadcast('playerCreated', { players })
  } else {
    emit('maxPlayers')
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

const attack = ({ id }) => {
  const player = players.find(p => p.id === id)

  if (player) {
    player.attack()
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

          // OPTIMIZE: call directly in a Object of events? eg: `events[event]`
          switch(event) {
            case 'join':
              join(data)
              break
            case 'moveLeft':
              moveLeft(data)
              break
            case 'moveRight':
              moveRight(data)
              break
            case 'idle':
              idle(data)
              break
            case 'attack':
              attack(data)
              break
          }
        }
      })

      connection.on('close', (reasonCode, description) => {
        info(`Server: peer ${connection.remoteAddress} disconnected`)

        // clients.splice(index, 1)

        if (heroConnected()) {
          deletePlayer()

          // Avoid disconnection first scenario
          // if (game.players.length) {
          //   playerId--
          // }

          broadcast('quit', { players })
        }
      })
    })
  }
}
