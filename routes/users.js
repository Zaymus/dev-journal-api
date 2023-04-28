const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const goalsController = require("../controllers/goals");
const isAuth = require('../middleware/is-auth');

router.post("/new", usersController.postCreateUser);

router.post("/login", usersController.postLogin);

router.post("/goals", isAuth, goalsController.postGoal);

router.get("/goals", isAuth, goalsController.getGoals);

router.patch("/goals/update/:goalId", isAuth, goalsController.updateGoal);

router.get("/goals/:goalId", isAuth, goalsController.getGoalById);

router.patch("/goals/:goalId", isAuth, goalsController.patchGoal);

router.delete("/goals/:goalId", isAuth, goalsController.deleteGoal);

router.get("/:userId", usersController.getUserById);

router.delete("/:userId", usersController.deleteUser);

router.patch("/notifications/:userId", usersController.postNotificationPerms);

module.exports = router;