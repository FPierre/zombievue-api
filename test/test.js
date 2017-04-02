const chai = require('chai')
const expect = chai.expect

const io = require('socket.io-client')
const ioServer = require('socket.io').listen(1338)

describe('Game server', () => {
  let socket

  beforeEach((done) => {
    socket = io.connect('http://localhost:1338', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection' : true
      , transports: ['websocket']
    })

    socket.on('connect', () => {
      done()
    })

    socket.on('disconnect', () => {
      // console.log('disconnected...')
    })
  })

  afterEach((done) => {
    if (socket.connected) {
      socket.disconnect()
    }

    ioServer.close()
    done()
  })

  it('should communicate', (done) => {
    // Once connected, emit Hello World
    ioServer.emit('echo', 'Hello World')

    socket.once('echo', (message) => {
      // Check that the message matches
      expect(message).to.equal('Hello World')
      done()
    })

    ioServer.on('connection', (socket) => {
      expect(socket).to.not.be.null
    })
  })
})
