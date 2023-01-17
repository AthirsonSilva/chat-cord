const moment = require('moment')

function formatMessage(username, text) {
	return {
		username,
		text: text,
		time: moment().format('DD/MM/YYYY - h:mm a'),
	}
}

module.exports = formatMessage
