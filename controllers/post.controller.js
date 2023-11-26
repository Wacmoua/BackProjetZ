const jwt_decode = require('jwt-decode');
const PostModel = require("../models/post.model");
const mongoose = require("mongoose");


module.exports.getPosts = async (req, res) => {
  try {
    // Récupérez les posts triés par date de création décroissante
    const posts = await PostModel.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports.setPosts = async (req, res) => {
  if (!req.body.message) {
    res.status(400).json({ message: "Merci d'ajouter un message" });
    return; // Ajout pour éviter l'exécution du code suivant en cas d'erreur
  }

  const post = await PostModel.create({
    message: req.body.message,
    author: req.userId, // Pas besoin de spécifier l'auteur explicitement ici
  });

  res.status(200).json(post);
};

module.exports.editPost = async (req, res) => {
  const post = await PostModel.findById(req.params.id);

  if (!post) {
    return res.status(400).json({ message: "Ce post n'existe pas" });
  }

  const updatePost = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatePost);
};

module.exports.deletePost = async (req, res) => {

  let post;

  post = await PostModel.findById(req.params.id);

  if (!post) {
    res.status(400).json({ message: "Ce post n'existe pas" });
  }
  await post.deleteOne({ _id: req.params.id })
  res.status(200).json("Message supprimé " + req.params.id);
};
module.exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Vérifiez si le post existe
    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé." });
    }

    // Vérifiez si l'utilisateur a déjà liké le post
    if (post.likers.some(liker => liker && liker.userId && liker.userId.equals(userId))) {
      return res.status(400).json({ message: "Vous avez déjà liké ce post." });
    }

    console.log("UserId in likePost:", userId);
    // Ajoutez l'ID de l'utilisateur à la liste des likers
    post.likers.push({ userId });

    // Sauvegardez les modifications dans la base de données
    await post.save();

    // Population des likers avec les noms d'utilisateur
    const updatedPost = await PostModel.findById(id)
      .populate('author', 'username')
      .populate('likers.userId', 'username');

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Erreur lors du like du post:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};




module.exports.dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req;

    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { $pull: { likers: username } },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json(err);
  }
};
