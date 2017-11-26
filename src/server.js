const http = require('http')
const WebSocketServer = require('websocket').server

const { broadcast, emit } = require('./socket-actions')
const { players, undeads, createUndead, canCreateUndead, moveUndeads, deletePlayer } = require('./game')
const { info, warning } = require('./logger')
const { join, moveLeft, moveRight, idle, attack } = require('./player-actions')

global.clients = []
global.connection = null

// const clients = []
// let connection = null

const originIsAllowed = origin => {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

const loop = () => {
  info('Server: loop')

  if (canCreateUndead()) {
    createUndead()
  }

  moveUndeads()
  broadcast('undeadsMoved', { undeads })
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

      global.connection = request.accept('echo-protocol', request.origin)

      // Client index to remove them on 'close' event
      const index = clients.push(global.connection) - 1

      info('Server: connection accepted')

      if (players.length) {
        setInterval(() => loop(), 1000)
      }

      global.connection.on('message', message => {
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

      global.connection.on('close', (reasonCode, description) => {
        info(`Server: peer ${global.connection.remoteAddress} disconnected`)

        // clients.splice(index, 1)

        deletePlayer()

        // Avoid disconnection first scenario
        // if (game.players.length) {
        //   playerId--
        // }

        broadcast('quit', { players })
      })
    })
  }
}
