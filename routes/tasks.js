const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasks");
const isAuth = require("../middleware/is-auth");

router.post("/new", isAuth, tasksController.create);

module.exports = router;