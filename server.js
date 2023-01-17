const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socket(server)
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
	console.log('New client connected...')
})

server.listen(PORT, () =>
	console.log(`Server is running on port http://localhost:${PORT}`)
)
