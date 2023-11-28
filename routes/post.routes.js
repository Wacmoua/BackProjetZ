const express = require("express");
const cors = require("cors"); // Importez le module cors
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

// Middleware CORS - Ajoutez-le au début
router.use(cors());

// Middleware pour extraire le nom d'utilisateur du token
router.use(authenticateUser);

router.get("/",  getPosts);
router.post("/",  setPosts);
router.put("/:id",  editPost);
router.delete("/:id",  deletePost);
router.patch("/like-post/:id",  likePost);
router.patch("/dislike-post/:id",  dislikePost);


module.exports = router;

