const chai = require('chai')
const expect = chai.expect

const io = require('socket.io-client')
// const server = require('socket.io').listen(1338)
// const server = require('socket.io').listen(1337)

const socketURL = 'http://localhost:1337'
const options = {
  // 'reconnection delay': 0,
  // 'reopen delay': 0,
  forceNew: true,
  // 'autoConnect': false,
  reconnection: false,
  // 'force new connection': true,
  transports: ['websocket']
}

describe('Game server', () => {
  // let socket
  //
  // beforeEach((done) => {
  //   client = io.connect('http://localhost:1337', {
  //     'reconnection delay': 0,
  //     'reopen delay': 0,
  //     'force new connection': true,
  //     transports: ['websocket']
  //   })
  //
  //   // client.on('connect', () => {
  //   //   console.log('connect')
  //   //   done()
  //   // })
  //
  //   client.on('disconnect', () => {
  //     // console.log('disconnected...')
  //   })
  // })
  //
  // afterEach((done) => {
  //   if (client.connected) {
  //     client.disconnect()
  //   }
  //
  //   // server.close()
  //   done()
  // })

  it('Should emit new hero, players and undeads to new hero', (done) => {
    const client = io.connect(socketURL, options)

    client.on('heroCreated', ({ hero, players, undeads }) => {
      expect(hero).to.include.keys(['name', 'x', 'color'])
      // Can be empty if no others player already joined
      expect(players).to.be.a('array')
      // Can be empty if no undeads already created
      expect(undeads).to.be.a('array')

      done()
    })

    client.emit('join')
  })

  it('Should broadcast players to players but not hero', (done) => {
    const client1 = io.connect(socketURL, options)
    const client2 = io.connect(socketURL, options)

    client2.on('playerCreated', (players) => {
      expect(players).to.be.a('array')

      done()
    })

    client1.emit('join')
  })


      // client.on('ok', () => {
        // console.log('ok')
      // })
      // const client2 = io.connect(socketURL, options)
      //
      // client2.on('connect', (data) => {
      //   client.emit('join')
      // })
    // })

    // done()

  // it('Should broadcast players to all player exept hero')

  //
  // it('should communicate', (done) => {
  //   // Once connected, emit Hello World
  //   // server.emit('echo', 'Hello World')
  //
  //   socket.once('join', (message) => {
  //     // Check that the message matches
  //     expect(message).to.equal('Hello World')
  //     done()
  //   })
  //
  //   // server.on('connection', (socket) => {
  //   //   expect(socket).to.not.be.null
  //   // })
  // })
})
