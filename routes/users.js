const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

router.post("/new", usersController.postCreateUser);

router.post("/login", usersController.postLogin);

router.delete("/:userId", usersController.deleteUser);

module.exports = router;