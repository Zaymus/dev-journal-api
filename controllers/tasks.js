const User = require("../models/user");
const Task = require("../models/task");
const { TASK_STATUS, TASK_FREQUENCIES, env } = require("../util/constants");

exports.create = async (req, res, next) => {
  const name = req.body.name;
  const status = req.body.status;
  const repeat = req.body.repeat;
  const date = req.body.date;
  const frequency = req.body.frequency;

  try {
    if (repeat) {
      if (frequency.length != 2){
        const error = new Error('Invalid frequency, must match the format of nD/nW (1D for daily, 1W for weekly, etc.)');
        error.statusCode = 400;
        throw error;
      }

      if (Number(frequency[0]) == NaN) {
        const error = new Error('Invalid frequency, first digit must be the number of days or weeks that the task will repeat on (1 for every day/week, 2 for every other day/week, etc.)');
        error.statusCode = 400;
        throw error;
      }

      if (!Object.values(TASK_FREQUENCIES).includes(frequency[1])) {
        const error = new Error('invalid frequency, second digit must be either \'D\' or \'W\'');
        error.statusCode = 400;
        throw error;
      }
    }
    
    const task = await Task.create({
      name: name,
      status: status,
      repeat: repeat,
      date: date,
      frequency: frequency,
      author: req.userId,
    });
    
    res.status(200).json(task);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}