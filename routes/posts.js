const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const isAuth = require("../middleware/is-auth");

router.post("/new", isAuth, postsController.postCreatePost);

router.get("/all", isAuth, postsController.getAllPosts);

router.get("/:postId", isAuth, postsController.getPostById);

router.patch("/edit/:postId", isAuth, postsController.patchPost);

router.delete("/delete/:postId", isAuth, postsController.deletePost);

module.exports = router;