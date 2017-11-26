// const { connection, clients } = require('./server')

module.exports = {
  emit: (event, data) => global.connection.sendUTF(JSON.stringify({ event, data })),

  broadcast: (event, data) => {
    for (let i = 0; i < global.clients.length; i++) {
      global.clients[i].sendUTF(JSON.stringify({ event, data }))
    }
  }
}
