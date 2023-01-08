const { DailyLog, ConversationLog, SolutionLog} = require("../models/post");
const User = require("../models/user");
const { POST_TYPES, env } = require("../util/constants");

exports.postCreatePost = (req, res, next) => {
  const date = new Date();
  const type = req.query.type;
  const editWindow = new Date().setUTCHours(23, 59, 59, 999);

  User.findById(req.userId)
  .then(user => {
    if (type === POST_TYPES.DAILY_LOG) {
      DailyLog.create({
        date: date,
        author: user._id,
        editWindow: editWindow,
        type: type,
        accomplished: req.body.accomplished,
        didWell: req.body.didWell,
        tomorrowTasks: req.body.tomorrowTasks,
      })
      .then(post => {
        user.posts.push(post);
        return user.save();
      })
      .then(result => {
        res.status(201).json({message: "Post created Successfully!"});
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      })
    } else if (type === POST_TYPES.CONVERSATION_LOG) {
      ConversationLog.create({
        date: date,
        author: user._id,
        type: type,
        colleague: req.body.colleague,
        notes: req.body.notes,
      })
      .then(post => {
        user.posts.push(post);
        return user.save();
      })
      .then(result => {
        res.status(201).json({message: "Post created Successfully!"});
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      })
    } else if (type === POST_TYPES.SOLUTION_LOG) {
      SolutionLog.create({
        date: date,
        author: user._id,
        type: type,
        problem: req.body.problem,
        solution: req.body.solution,
      })
      .then(post => {
        user.posts.push(post);
        return user.save();
      })
      .then(result => {
        res.status(201).json({message: "Post created Successfully!"});
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      })
    } else {
      const error = new Error(`Unknown post type: \"${type}\".`);
      error.statusCode = 500;
      next(error);
    }
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.getAllPosts = (req, res, next) => {
  let userId = req.userId ? req.userId : env.DEFAULT_USER_ID;

  DailyLog.find({author: userId})
  .then(posts => {
    if (!posts.length > 0) {
      const error = new Error('Could not retrieve posts');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json(posts);
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.getPostById = (req, res, next) => {
  const postId = req.params.postId;

  DailyLog.findById(postId)
  .then(post => {
    res.status(200).json(post);
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}