const Task = require("../models/task");
const { TASK_FREQUENCIES } = require("../util/constants");

exports.create = async (req, res, next) => {
  const name = req.body.name;
  const status = req.body.status;
  const repeat = req.body.repeat;
  const date = new Date();
  const frequency = req.body.frequency;
  const duration = req.body.duration || '1D';
  var nextDate = null;

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

      if (duration.length != 2){
        const error = new Error('Invalid duration, must match the format of nD/nW (1D for daily, 1W for weekly, etc.)');
        error.statusCode = 400;
        throw error;
      }

      if (Number(duration[0]) == NaN) {
        const error = new Error('Invalid duration, first digit must be the number of days or weeks that the task will repeat on (1 for every day/week, 2 for every other day/week, etc.)');
        error.statusCode = 400;
        throw error;
      }

      if (!Object.values(TASK_FREQUENCIES).includes(duration[1])) {
        const error = new Error('invalid duration, second digit must be either \'D\' or \'W\'');
        error.statusCode = 400;
        throw error;
      }
      nextDate = Task.getNextActiveDate(date, frequency);
    }
    
    const task = await Task.create({
      name: name,
      status: status,
      repeat: repeat,
      date: date,
      frequency: frequency,
      author: req.userId,
      nextDate: nextDate,
      duration: duration,
      endDate: Task.getEndDate(date, duration),
    });
    
    res.status(201).json(task);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getTasks = async(req, res, next) => {
  try {
    const tasks = await Task.find({author: req.userId});
    if (!tasks) {
      const error = new Error('Could not find tasks');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(tasks);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getTaskById = async(req, res, next) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.find({$and: [{_id: taskId}, {author: req.userId}]});
    if (!task) {
      const error = new Error('Could not find task');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(task);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}