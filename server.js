const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socket(server)
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (connection) => {
	connection.emit('message', 'Welcome to the chat app')

	// Broadcast when a user connects
	connection.broadcast.emit('message', `The user has joined the chat`)

	connection.on('disconnect', () => {
		io.emit('message', `The user has left the chat`)
	})

	connection.on('chatMessage', (msg) => {
		io.emit('message', msg)
	})
})

server.listen(PORT, () =>
	console.log(`Server is running on port http://localhost:${PORT}`),
)
