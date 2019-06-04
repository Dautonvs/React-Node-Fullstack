const express = require("express");

const {
  getPosts,
  createPost,
  postsByUser,
  postById,
  isPoster,
  deletePost,
  updatePost
} = require("../controllers/post");

const {requireSignin} = require("../controllers/auth");
const {userById} = require("../controllers/user");
const {createPostValidator} = require("../validator");

const router = express.Router();

router.get("/posts", getPosts);
router.post(
      "/post/new/:userId",
      requireSignin,
      createPost,
      createPostValidator
);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);


//any route containing :userId, our app will first execute userById()
router.param("userId", userById);
//any route containing :userId, our app will first execute postById()
router.param("postId", postById);

module.exports = router;
