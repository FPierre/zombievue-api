const chai = require('chai')
const expect = chai.expect

const io = require('socket.io-client')

const socketURL = 'http://localhost:1337'
const options = {
  forceNew: true,
  reconnection: false,
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

  it('Should emit players and undeads to new hero', (done) => {
    const client = io.connect(socketURL, options)

    client.on('heroCreated', ({ players, undeads }) => {
      expect(players).to.be.a('object')
      // expect(players).to.include.keys(['id', 'name', 'x', 'color'])
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
      expect(players).to.be.a('object')

      done()
    })

    client1.emit('join')
  })
})
