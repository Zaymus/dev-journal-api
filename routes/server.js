const express = require("express");
const router = express.Router();
const { SERVER_STATUS } = require("../util/constants");

router.get("/health", (req, res, next) => {
	res.json({ status: SERVER_STATUS.UP });
});

module.exports = router;
