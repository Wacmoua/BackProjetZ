const express = require("express");
const cors = require("cors");
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  setPosts,
  getPosts,
  editPost,
  deletePost,
  likePost,
  dislikePost,
  
} = require("../controllers/post.controller");

const router = express.Router();

router.use(cors());
router.use(authenticateUser);

router.get("/", getPosts);
router.post("/", setPosts);
router.put("/:id", editPost);
router.delete("/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/dislike-post/:id", dislikePost);



module.exports = router;


