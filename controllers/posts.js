const { DailyLog, ConversationLog, SolutionLog} = require("../models/post");
const User = require("../models/user");
const { POST_TYPES, env } = require("../util/constants");

exports.postCreatePost = (req, res, next) => {
  const date = new Date();
  const type = req.query.type;
  var postData;

  User.findById(req.userId)
  .then(user => {
    if (type === POST_TYPES.DAILY_LOG) {
      DailyLog.create({
        date: date,
        author: user._id,
        type: type,
        accomplished: req.body.accomplished,
        didWell: req.body.didWell,
        tomorrowTasks: req.body.tomorrowTasks,
      })
      .then(post => {
        postData = post;
        user.posts.push(post);
        return user.save();
      })
      .then(result => {
        res.status(201).json({message: "Post created Successfully!", post: postData});
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
        postData = post;
        user.posts.push(post);
        return user.save();
      })
      .then(result => {
        res.status(201).json({message: "Post created Successfully!", post: postData});
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
        postData = post;
        user.posts.push(post);
        return user.save();
      })
      .then(result => {
        res.status(201).json({message: "Post created Successfully!", post: postData});
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

exports.patchPost = (req, res, next) => {
  const postId = req.params.postId;
  const postType = req.query.postType;
  const dailyLogDoc = {
    $set: {
      accomplished: req.body.accomplished, 
      didWell: req.body.didWell, 
      tomorrowTasks: req.body.tomorrowTasks
    }
  };
  const conversationLogDoc = {
    $set: {
      colleague: req.body.colleague, 
      notes: req.body.notes, 
    }
  };
  const solutionLogDoc = {
    $set: {
      problem: req.body.problem, 
      solution: req.body.solution, 
    }
  };
  var docType;
  var updateDoc;

  if (postType === POST_TYPES.DAILY_LOG) {
    docType = DailyLog;
    updateDoc = dailyLogDoc;
  } else if (postType === POST_TYPES.CONVERSATION_LOG) {
    docType = ConversationLog;
    updateDoc = conversationLogDoc;
  } else if (postType === POST_TYPES.SOLUTION_LOG) {
    docType = SolutionLog;
    updateDoc = solutionLogDoc;
  } else {
    const error = new Error(`Unknown post type: \"${type}\".`);
    error.statusCode = 500;
    next(error);
  }

  if(updateDoc && docType) {
    docType.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error(`Could not find post: ${postId}`);
        error.statusCode = 400;
        throw error;
      }
      return post.type === POST_TYPES.DAILY_LOG ? post.editable : true;
    })
    .then(editable => {
      if (!editable) {
        const error = new Error('Post is no longer availble to be edited.');
        error.statusCode = 400;
        throw error;
      }

      docType.updateOne({_id: postId}, updateDoc)
      .then(result => {
        if(!result.acknowledged) {
          const error = new Error('Post update failed.');
          error.statusCode = 500;
          throw error;
        }
        if(!result.matchedCount) {
          const error = new Error(`Failed to fetch post with id: ${postId}.`);
          error.statusCode = 404;
          throw error;
        }
        if (!result.modifiedCount) {
          res.status(200).json({message: "Post has been saved.", postId: postId});
        } else {
          res.status(200).json({message: "Post has been saved and updated.", postId: postId});
        }
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  }
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  DailyLog.deleteOne({_id: postId})
  .then(result => {
    if(!result.acknowledged || !result.deletedCount) {
      const error = new Error('Unable to find or delete post.');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({message: `Post ${postId} was successfully deleted.`});
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}