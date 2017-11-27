require('dotenv').config({ path: `./config/.env.${process.env.NODE_ENV}` })

global.players = []
global.undeads = []
global.clients = []
global.connection = null

const { start } = require('./src/server')

start()
