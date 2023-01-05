const dotenv = require("dotenv").config();

const env = process.env;

const userValidation = {
	EMAIL_FORMAT: new RegExp(/^([A-Za-z0-9])+@([A-Za-z0-9])+..([A-Za-z]{2,4})$/),
	PASSWORD_FORMAT:
		new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
};

SERVER_STATUS = {
	UP: "up",
};

module.exports = {
	env,
  userValidation,
  SERVER_STATUS,
}