const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
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
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model("tasks", taskSchema);