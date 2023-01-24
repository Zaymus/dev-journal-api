const { DailyLog, ConversationLog, SolutionLog, Note } = require("../models/post");
const User = require("../models/user");
const { POST_TYPES, env } = require("../util/constants");

exports.postCreatePost = async (req, res, next) => {
  const date = new Date();
  const type = req.query.type;
  
  if(!Object.values(POST_TYPES).includes(type)) {
    const error = new Error(`Unknown post type: \"${type}\".`);
    error.statusCode = 500;
    next(error);
  }

  const user = await User.findById(req.userId);

  if (!user) {
    const error = new Error(`Could not find user with id: ${req.userId}`);
    error.statusCode = 400;
    next(error);
  }

  if (type === POST_TYPES.DAILY_LOG) {
    try {
      const post = await DailyLog.create({
        date: date,
        author: user._id,
        type: type,
        accomplished: req.body.accomplished,
        didWell: req.body.didWell,
        tomorrowTasks: req.body.tomorrowTasks,
      });

      res.status(201).json({message: "Post created Successfully!", post: post});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    } 
  } else if (type === POST_TYPES.CONVERSATION_LOG) {
    try {
      const post = await ConversationLog.create({
        date: date,
        author: user._id,
        type: type,
        colleague: req.body.colleague,
        notes: req.body.notes,
      });

      res.status(201).json({message: "Post created Successfully!", post: post});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else if (type === POST_TYPES.SOLUTION_LOG) {
    try {
      const post = await SolutionLog.create({
        date: date,
        author: user._id,
        type: type,
        problem: req.body.problem,
        solution: req.body.solution,
      });
      
      res.status(201).json({message: "Post created Successfully!", post: post});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
    
  } else if (type === POST_TYPES.NOTE) {
    var tags = req.body.tags?.toLowerCase().split('|');

    if(!tags) {
      tags = "";
    }

    try {
      const post = await Note.create({
        date: date,
        title: req.body.title,
        content: req.body.content,
        tags: tags,
      });
      
      res.status(201).json({message: "Post created Successfully!", post: post});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}

exports.getAllPosts = async (req, res, next) => {
  let userId = req.userId ? req.userId : env.DEFAULT_USER_ID;

  try {
    const posts = await DailyLog.find({author: userId});
    
    if (!posts.length > 0) {
      const error = new Error('Could not retrieve posts');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json(posts);
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getPostById = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await DailyLog.findById(postId);

    res.status(200).json(post);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getPostsByTags = async (req, res, next) => {
  const tags = req.body.tags?.split('|');
  if (!tags[0].length > 0) {
    const error = new Error('No tags supplied');
    error.statusCode = 400;
    next(error);
  }

  try {
    const posts = await Note.find({tags: {$in: tags}});
    if (!posts.length > 0) {
      const error = new Error(`Could not find posts with tags: ${tags.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({postCount: posts.length, posts: posts});
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.patchPost = async (req, res, next) => {
  const postId = req.params.postId;
  const postType = req.query.postType;

  if(!Object.values(POST_TYPES).includes(postType)) {
    const error = new Error(`Unknown post type: \"${postType}\".`);
    error.statusCode = 500;
    next(error);
  }

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
  const noteDoc = {
    $set: {
      title: req.body.title,
      content: req.body.content,
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
  } else if (postType === POST_TYPES.NOTE) {
    docType = Note;
    updateDoc = noteDoc;
  }

  if(updateDoc && docType) {
    try {
      const post = await docType.findById(postId);

      if (!post) {
        const error = new Error(`Could not find post: ${postId}`);
        error.statusCode = 400;
        throw error;
      }
      const editable = post.type === POST_TYPES.DAILY_LOG ? post.editable : true;

      if (!editable) {
        const error = new Error('Post is no longer availble to be edited.');
        error.statusCode = 400;
        throw error;
      }

      const result = await docType.updateOne({_id: postId}, updateDoc);

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
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const result = await DailyLog.deleteOne({_id: postId});

    if(!result.acknowledged || !result.deletedCount) {
      const error = new Error('Unable to find or delete post.');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({message: `Post ${postId} was successfully deleted.`});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}