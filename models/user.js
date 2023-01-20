const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { userValidation } = require("../util/constants");

const goalSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeline: {
    type: Date,
    required: true,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  updates: [
    {
      description: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      }
    }
  ]
})

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  goals: [
    goalSchema 
  ],
});

userSchema.statics.verifyEmail = (email) => {
  let isValidEmail = userValidation.EMAIL_FORMAT.test(email);

  if (!isValidEmail) {
    const error = new Error("Invalid email address.");
    error.statusCode = 400;
    throw error;
  }

  return true;
};

userSchema.statics.verifyPassword = (password) => {
  let isValidPassword = userValidation.PASSWORD_FORMAT.test(password);

  if (!isValidPassword) {
    const error = new Error("Invalid password. A valid password must contain an uppercase character, a number, and a symbol (!, @, #, $, %, ^, &, *).");
    error.statusCode = 400;
    throw error;
  }

  return true
};

module.exports = mongoose.model("User", userSchema);