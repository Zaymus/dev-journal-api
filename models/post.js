const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    required: true,
  },
  accomplished: {
    type: String,
    required: true,
    minlength: 3,
  },
  didWell: {
    type: String,
    required: true,
    minlength: 3,
  },
  tomorrowTasks: {
    type: String,
    required: true,
    minlength: 3,
  },
});

const conversationSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  colleague: {
    type: String,
    required: true,
    minlength: 3,
  },
  notes: {
    type: String,
    required: true,
    minlength: 3,
  },
});

const solutionSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
    required: true,
    minlength: 3,
  },
  solution: {
    type: String,
    required: true,
    minlength: 3,
  },
});

const noteSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 3,
  },
  tags: [{
    type: String,
    required: false,
  }],
})

const DailyLog = mongoose.model("DailyLog", logSchema, "posts");
const ConversationLog = mongoose.model("Conversation", conversationSchema, "posts");
const SolutionLog = mongoose.model("Solution", solutionSchema, "posts");
const Note = mongoose.model("Note", noteSchema, "posts");

module.exports = {
  DailyLog,
  ConversationLog,
  SolutionLog,
  Note,
}