const express = require("express");
const cors = require("cors");
const { authenticateUser } = require("../middleware/authMiddleware");
const CommentModel = require("../models/comment.model");
const {
  createComment,
  getComments,
  editComment,
  deleteComment,
} = require("../controllers/comment.controller");

const router = express.Router();

router.use(cors());
router.use(authenticateUser);

router.post("/:postId/comments", createComment);
router.get('/:postId/comments', async (req, res) => {
  try {
      const postId = req.params.postId;

      // Utilisez le modèle de commentaire pour récupérer les commentaires associés à un post
      const comments = await CommentModel.find({ post: postId });

      // Renvoyez les commentaires au client
      res.status(200).json(comments);
  } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
  }
});
router.put("/:postId/comments/:commentId", editComment);
router.delete("/:postId/comments/:commentId", deleteComment);

module.exports = router;