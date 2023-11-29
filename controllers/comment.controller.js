const jwt_decode = require('jwt-decode');
const PostModel = require("../models/post.model");
const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model')
const mongoose = require("mongoose");

module.exports.createComment = async (req, res) => {
    try {
      const { postId, message } = req.body;
  
      if (!message) {
        return res.status(400).json({ message: "Le message du commentaire est requis" });
      }
  
      const user = await UserModel.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }
  
      const post = await PostModel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post introuvable" });
      }
  
      const comment = await CommentModel.create({
        message,
        author: req.userId,
        post: postId,
      });
  
      // Ajoutez le commentaire au post
      post.comments.push(comment._id);
      await post.save();
  
      res.status(200).json(comment);
    } catch (error) {
      console.error("Erreur lors de la création du commentaire:", error);
      res.status(500).json({ message: "Erreur lors de la création du commentaire" });
    }
  };
  
  module.exports.getComments = async (req, res) => {
    try {
      const postId = req.params.postId;
      
      const post = await PostModel.findById(postId).populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username', // Vous pouvez ajuster les champs que vous souhaitez récupérer pour l'auteur
        },
      });
  
      if (!post) {
        return res.status(404).json({ message: "Post introuvable" });
      }
  
      const comments = post.comments;
  
      res.status(200).json(comments);
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  };
  
  module.exports.editComment = async (req, res) => {
    try {
      const { commentId, message } = req.body;
  
      if (!message) {
        return res.status(400).json({ message: "Le message du commentaire est requis" });
      }
  
      const comment = await CommentModel.findByIdAndUpdate(commentId, { message }, { new: true });
  
      if (!comment) {
        return res.status(404).json({ message: "Commentaire introuvable" });
      }
  
      res.status(200).json(comment);
    } catch (error) {
      console.error("Erreur lors de l'édition du commentaire:", error);
      res.status(500).json({ message: "Erreur lors de l'édition du commentaire" });
    }
  };
  
  module.exports.deleteComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
  
      const comment = await CommentModel.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: "Commentaire introuvable" });
      }
  
      // Supprimez le commentaire du post
      const post = await PostModel.findById(comment.post);
      post.comments = post.comments.filter(comment => !comment.equals(commentId));
      await post.save();
  
      // Supprimez le commentaire
      await comment.deleteOne({ _id: commentId });
  
      res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
      res.status(500).json({ message: "Erreur serveur lors de la suppression du commentaire" });
    }
  };

