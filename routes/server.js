const express = require("express");
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const router = express.Router();
const { SERVER_STATUS, POST_TYPES } = require("../util/constants");
const { DailyLog } = require("../models/post");

router.get("/health", (req, res, next) => {
	res.json({ status: SERVER_STATUS.UP });
});

// const mailOptions = {
// 	host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: env.MAIL_USER,
//     pass: env.MAIL_PASS,
//   }
// };

// var transport = nodemailer.createTransport(mailOptions, function (err, info) {
// 	if(err)
// 		console.log(err);
// 	else
// 		console.log(info);
// });

// transport.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

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
