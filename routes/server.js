const express = require("express");
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const router = express.Router();
const { SERVER_STATUS, POST_TYPES, env } = require("../util/constants");
const { DailyLog } = require("../models/post");
const User = require("../models/user");

router.get("/health", (req, res, next) => {
	res.json({ status: SERVER_STATUS.UP });
});

const mailOptions = {
	host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  }
};

var transport = nodemailer.createTransport(mailOptions, function (err, info) {
	if(err)
		console.log(err);
	else
		console.log(info);
});

const dailyLogReminder = cron.schedule('0 0 22 * * 0-6', () => {
	console.log("Reminding user to make or update daily log");
	User.find()
		.then(users => {
			if(!users.length > 0) {
				const error = new Error('Could not retrieve users.');
				error.statusCode = 500;
				throw error;
			}

			users.forEach(user => {
				if (!user.email.length > 0) {
					return;
				}

				transport.sendMail({
					to: user.email,
					from: "no-reply@api.com",
					subject: "Today's daily log posting.",
					html: `<h1>Today's daily log will be unavailable to be edited at midnight!</h1>`
				});
			})
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
	});

const updatePostEditability = cron.schedule('59 59 23 * * 0-6', () => {
	console.log("Updating post editability");
	const start = new Date();
	start.setUTCHours(0, 0, 0, 0);
	const end = new Date();
	end.setUTCHours(23, 59, 59, 999);

	const updateDoc = {
		$set: {
			editable: false
		},
	}

	DailyLog.updateMany(
		{$and: [
			{date: {$gte: start, $lte: end}},
			{type: POST_TYPES.DAILY_LOG}
		]}, updateDoc)
	.catch(err => {
		console.log(err);
	})
});

module.exports = router;
