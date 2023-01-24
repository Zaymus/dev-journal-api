const bcrypt = require("bcryptjs");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { env } = require('../util/constants');

const verifyData = (userData) => {
  let isValidEmail = User.verifyEmail(userData.email);
	let isValidPassword = User.verifyPassword(userData.password);
  return isValidEmail && isValidPassword;
};

exports.postCreateUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const isValidData = verifyData({
    email: email,
    password: password
  });

  if(isValidData) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        email: email,
        password: hashedPassword
      });

      const users = await User.find({email: email});

      if (users.length > 1) {
        const error = new Error("Email address is already in use. Please use another one.");
        error.statusCode = 400;
        const result = await User.deleteOne({_id: user._id});
        next(error);
      }
      else {
        res.status(201).json(user);
      }
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({email: email});
    if (!user) {
      const error = new Error("Incorrect email/password, please Try again");
      error.statusCode = 400;
      next(error);
    } else {
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        const error = new Error("Incorrect email/password, please Try again");
        error.statusCode = 400;
        next(error);
      } else {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          env.JWT_SECRET,
          {expiresIn: '1h'}
        );

        res.status(200).json({token: token, userId: user._id.toString()});
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error(`Could not find a user with the given id.`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      const error = new Error(`Could not find a user with the given id.`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.postNotificationPerms = async (req, res, next) => {
  const userId = req.params.userId;
  const preference = req.query.enabled;

  const updateDoc = {
    $set: {
      notificationsEnabled: preference
    }
  }

  try {
    const result = await User.updateOne({_id: userId}, updateDoc);
    if (!result.matchedCount) {
      const error = new Error('Could not find user.');
      error.statusCode = 400;
      throw error;
    }
    if (!result.modifiedCount) {
      res.status(200).json({message: "User notification preferences saved."});
    }

    res.status(200).json({message: "User notification preferences saved and updated."});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}