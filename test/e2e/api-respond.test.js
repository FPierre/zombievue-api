require('dotenv').config({ path: './config/.env.test' })

const test = require('ava')
const W3CWebSocket = require('websocket').w3cwebsocket

const { start } = require('../../src/server')

test.before.serial(() => {
  start()
})

test.serial('success', t => {
  const client = new W3CWebSocket(`ws://localhost:${process.env.PORT}/`, 'echo-protocol')

  client.onerror = () => {
    console.log('Client: connection error')
  }

  client.onopen = () => {
    console.log('Client: websocket client connected')

    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ event: 'join', data: { playerType: null } }))
    }
  }

  client.onclose = () => {
    console.log('Client: echo-protocol client closed')
  }

  client.onmessage = e => {
    if (typeof e.data === 'string') {
      console.log(`Client: received: '${e.data}'`)
    }
  }

  t.pass()
})
