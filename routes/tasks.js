const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasks");
const isAuth = require("../middleware/is-auth");

router.post("/new", isAuth, tasksController.create);

router.get("/", isAuth, tasksController.getTasks);

router.get("/:taskId", isAuth, tasksController.getTaskById);

module.exports = router;