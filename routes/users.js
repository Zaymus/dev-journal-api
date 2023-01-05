const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

router.post("/new", usersController.postCreateUser);

router.post("/login", usersController.postLogin);

module.exports = router;