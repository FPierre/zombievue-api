const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// app.use(express.static(__dirname + '/bower_components'))

// app.get('/', function(req, res,next) {
//   res.sendFile(__dirname + '/index.html')
// })

io.on('connection', function (client) {
  console.log('connection')

  client.on('connect', function (data) {
    console.log('connect')
    client.emit('connected')
  })

  client.on('move', function (xPosition) {
    console.log('move')
    client.broadcast.emit('moved', xPosition)
  })
})

server.listen(1337)
