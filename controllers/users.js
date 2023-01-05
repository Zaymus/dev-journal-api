const bcrypt = require("bcryptjs");
const User = require('../models/user');

const verifyData = (userData) => {
  let isValidEmail = User.verifyEmail(userData.email);
	let isValidPassword = User.verifyPassword(userData.password);
  return isValidEmail && isValidPassword;
};

exports.postCreateUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  verifyData({
    email: email,
    password: password
  });

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      return User.create({
        email: email,
        password: hashedPassword
      });
    })
    .then(user => {
      User.find({email: email}).then(users => {
        if (users.length > 1) {
          const error = new Error("Email address is already in use. Please use another one.");
          error.statusCode = 400;
          User.deleteOne(user)
          .then(result => {
            next(error);
          })
          .catch(err => {
            console.log(err);
          });
        }
        else {
          res.json(user);
        }
      })
      .catch(err => {
        throw err;
      });
    })
    .catch(err => {
      console.log(err);
      err.statusCode = 500;
      throw err;
    })
}