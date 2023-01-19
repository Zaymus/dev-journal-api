const User = require('../models/user');

exports.postGoal = async (req, res, next) => {
  try {
    const goal = {
      title: req.body.title,
      description: req.body.description,
      timeline: req.body.timeline,
    }

    const updateDoc = {
      $push: {
        goals: goal
      }
    }
    const result = await User.updateOne({_id: req.userId}, updateDoc);
    if (!result.matchedCount) {
      const error = new Error('Could not find user.');
      error.statusCode = 400;
      throw error;
    }

    if (!result.modifiedCount) {
      const error = new Error('Goal was unable to be added.');
      error.statusCode = 500;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 500;
      throw error;
    }

    const newGoal = user.goals[user.goals.length - 1];
    res.status(200).json({
      message: "Goal was successfully added.", 
      goal: newGoal,
    });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getGoalById = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error(`Could not retrieve user data with id: ${req.userId}`);
      error.statusCode(400);
      throw error;
    }

    const goal = user.goals.filter(goal => {
      return goal._id.toString() === req.params.goalId;
    })[0];
    
    if(!goal) {
      const error = new Error(`Could not find goal with id: ${req.params.goalId}`);
      error.statusCode = 400;
      throw error;
    }

    res.status(206).json(goal);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.updateGoal = async (req, res, next) => {
  try {
    const date = new Date();
    const updateDoc = {
      $set: {
        'goals.$.progress': req.body.progress,
        'goals.$.completed': req.body.progress == 100,
      },
      $push: {
        'goals.$.updates': {
          description: req.body.description,
          date: date,
        }
      }
    };

    const goalId = req.params.goalId;
    const result = await User.updateOne({
      _id: req.userId, 
      "goals._id": goalId
    }, updateDoc);
    
    if (!result.matchedCount) {
      const error = new Error('Could not find user or goal.');
      error.statusCode = 400;
      throw error;
    }

    if (!result.modifiedCount) {
      const error = new Error('Goal was unable to be updated.');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({message: "Goal was successfully updated", goalId: goalId});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.patchGoal = async (req, res, next) => {
  const goalId = req.params.goalId;
  try {
    const updateDoc = {
      $set: {
        'goals.$.title': req.body.title,
        'goals.$.description': req.body.description,
        'goals.$.timeline': req.body.timeline,
      }
    };

    const result = await User.updateOne({
      _id: req.userId, 
      "goals._id": goalId
    }, updateDoc);

    if (!result.matchedCount) {
      const error = new Error('Could not find user or goal.');
      error.statusCode = 400;
      throw error;
    }

    if (!result.modifiedCount) {
      const error = new Error('Goal was unable to be updated.');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({message: "Goal was successfully updated", goalId: goalId});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}