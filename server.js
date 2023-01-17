const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const formatMessage = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socket(server)
const PORT = process.env.PORT || 3000
const botName = 'ChatBot'

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (connection) => {
	connection.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

	// Broadcast when a user connects
	connection.broadcast.emit(
		'message',
		formatMessage(botName, `The user has joined the chat`),
	)

	connection.on('disconnect', () => {
		io.emit('message', formatMessage(botName, `The user has left the chat`))
	})

	connection.on('chatMessage', (msg) => {
		io.emit('message', formatMessage('User', msg))
	})
})

server.listen(PORT, () =>
	console.log(`Server is running on port http://localhost:${PORT}`),
)
