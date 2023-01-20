const express = require("express");
const router = express.Router();
const goalsController = require("../controllers/goals");

router.post("/", goalsController.postGoal);

router.patch("/update/:goalId", goalsController.updateGoal);

router.get("/:goalId", goalsController.getGoalById);

router.patch("/:goalId", goalsController.patchGoal);

router.delete("/:goalId", goalsController.deleteGoal);

module.exports = router;