const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socket(server)

const PORT = process.env.PORT || 3000
const botName = 'ChatBot'

const formatMessage = require('./utils/messages')
const {
	userJoins,
	getCurrentUser,
	userLeaves,
	getRoomsUsers,
} = require('./utils/users')

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (connection) => {
	connection.on('joinRoom', ({ username, room }) => {
		const user = userJoins(connection.id, username, room)

		connection.join(user.room)

		connection.emit(
			'message',
			formatMessage(botName, 'Welcome to ChatCord!'),
		)

		connection.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(
					botName,
					`The user ${user.username} has joined the chat`,
				),
			)

		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomsUsers(user.room),
		})
	})

	connection.on('chatMessage', (msg) => {
		const user = getCurrentUser(connection.id)

		io.to(user.room).emit('message', formatMessage(user.username, msg))
	})

	connection.on('disconnect', () => {
		const user = userLeaves(connection.id)
		console.log(user)

		if (user) {
			io.to(user.room).emit(
				'message',
				formatMessage(
					botName,
					`The user ${user.username} has left the chat`,
				),
			)

			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomsUsers(user.room),
			})
		}
	})
})

server.listen(PORT, () =>
	console.log(`Server is running on port http://localhost:${PORT}`),
)
