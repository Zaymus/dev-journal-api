const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { TASK_FREQUENCIES } = require('../util/constants')
const dateFns = require('date-fns');
 
const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 64
  },
  status: {
    type: String,
    required: true,
  },
  repeat: {
    type: Boolean,
    required: true,
    default: false,
  },
  frequency: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  nextDate: {
    type: Date,
    required: false,
  },
  duration: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 2,
  },
  endDate: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

taskSchema.statics.getNextActiveDate = (date, frequency) => {
  switch (frequency[1]) {
    case TASK_FREQUENCIES.DAY:
      return dateFns.addDays(date, parseInt(frequency[0])).setUTCHours(0, 0, 0, 0);;
    case TASK_FREQUENCIES.WEEK:
      return dateFns.addDays(date, parseInt(frequency[0]) * 7).setUTCHours(0, 0, 0, 0);;
    default:
      const error = new Error('invalid frequency.');
      error.statusCode = 500;
      throw error;
  }
}

taskSchema.statics.getEndDate = (date, duration) => {
  switch (duration[1]) {
    case TASK_FREQUENCIES.DAY:
      var endDate = dateFns.addDays(date, parseInt(duration[0]) - 1).setUTCHours(23, 59, 59, 999);
      return endDate
    case TASK_FREQUENCIES.WEEK:
      var endDate = dateFns.addDays(date, parseInt(duration[0]) * 6).setUTCHours(23, 59, 59, 999);
      return endDate
    default:
      const error = new Error('invalid duration.');
      error.statusCode = 500;
      throw error;
  }
}

module.exports = mongoose.model("tasks", taskSchema);