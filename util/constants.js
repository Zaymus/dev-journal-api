const dotenv = require("dotenv").config();

const env = process.env;

const allowedOrigins = [
	"http://localhost:3000",
	"https://devjournal.ca",
]

const userValidation = {
	EMAIL_FORMAT: new RegExp(/^([A-Za-z0-9])+@([A-Za-z0-9])+..([A-Za-z]{2,4})$/),
	PASSWORD_FORMAT:
		new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
};

SERVER_STATUS = {
	UP: "up",
};

POST_TYPES = {
	DAILY_LOG: "daily-log",
	SOLUTION_LOG: "solution",
	CONVERSATION_LOG: "conversation",
	NOTE: "note",
}

TASK_STATUS = {
	INCOMPLETE: "Incomplete",
	COMPELTE: "Compelted",
}

TASK_FREQUENCIES = {
	DAY: "D",
	WEEK: "W",
}

module.exports = {
	env,
  userValidation,
  SERVER_STATUS,
	POST_TYPES,
	TASK_STATUS,
	TASK_FREQUENCIES,
	allowedOrigins,
}