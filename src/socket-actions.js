const { connection, clients } = require('./server')

module.exports = {
  emit: (event, data) => connection.sendUTF(JSON.stringify({ event, data })),

  broadcast: (event, data) => {
    for (let i = 0; i < clients.length; i++) {
      clients[i].sendUTF(JSON.stringify({ event, data }))
    }
  }
}
