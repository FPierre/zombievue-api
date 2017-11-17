require('dotenv').config({ path: `./config/.env.${process.env.NODE_ENV}` })

const { start } = require('./src/server')

start()
