const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const goalRoutes = require('./goals');
const isAuth = require('../middleware/is-auth');

router.post("/new", usersController.postCreateUser);

router.post("/login", usersController.postLogin);

router.use("/goals", isAuth, goalRoutes);

router.get("/:userId", usersController.getUserById);

router.delete("/:userId", usersController.deleteUser);

router.patch("/notifications/:userId", usersController.postNotificationPerms);

module.exports = router;