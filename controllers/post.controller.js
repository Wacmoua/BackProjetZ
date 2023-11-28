const jwt_decode = require('jwt-decode');
const PostModel = require("../models/post.model");
const UserModel = require('../models/user.model');

const mongoose = require("mongoose");


module.exports.getPosts = async (req, res) => {
  try {
    // Récupérez les posts triés par date de création décroissante
    const posts = await PostModel.find().sort({ createdAt: -1 }).populate('author', 'username').populate('likers.userId', 'username').populate('dislikers.userId', 'username');

    res.status(200).json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports.setPosts = async (req, res) => {
  if (!req.body.message) {
    res.status(400).json({ message: "Merci d'ajouter un message" });
    return;
  }

  try {
    // Recherche de l'utilisateur dans la base de données
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }

    // Création du post avec le message et l'auteur
    const post = await PostModel.create({
      message: req.body.message,
      author: 
        req.userId,
      
    });

    res.status(200).json(post);
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    res.status(500).json({ message: "Erreur lors de la création du post" });
  }
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
  try {
    // Assurez-vous que l'utilisateur est authentifié
    if (!req.userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Recherchez le post par son ID
    const post = await PostModel.findById(req.params.id);

    // Vérifiez si le post existe
    if (!post) {
      return res.status(404).json({ message: "Ce post n'existe pas" });
    }


    // Vérifiez si l'utilisateur actuel est le propriétaire du post
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce post" });
    }

    // Supprimez le post
    
    await post.deleteOne({ _id: req.params.id });
    

    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du post :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du post" });
  }
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
    const isLiked = post.likers.some(liker => liker && liker.userId && liker.userId.equals(userId));

    // Si l'utilisateur a déjà aimé le post, annulez le like
    if (isLiked) {
      post.likers = post.likers.filter(liker => !liker.userId.equals(userId));
    } else {
      // Sinon, ajoutez l'ID de l'utilisateur à la liste des likers
      post.likers.push({ userId });
    }

    // Sauvegardez les modifications dans la base de données
    await post.save();

    // Population des likers avec les noms d'utilisateur
    const updatedPost = await PostModel.findById(id)
      .populate('author', 'username')
      .populate('likers.userId', 'username');

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Erreur lors du like ou unlike du post:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};



module.exports.dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Vérifiez si le post existe
    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé." });
    }

    // Retirez l'utilisateur de la liste des dislikers
    if (post.dislikers.some(disliker => disliker && disliker.userId && disliker.userId.equals(userId))) {
      // Annulez le dislike si l'utilisateur a déjà disliké le post
      post.dislikers = post.dislikers.filter(disliker => !disliker.userId.equals(userId));
    } else {
      // Ajoutez l'ID de l'utilisateur à la liste des dislikers
      post.dislikers.push({ userId });
    }

    // Sauvegardez les modifications dans la base de données
    await post.save();

    // Population des dislikers avec les noms d'utilisateur
    const updatedPost = await PostModel.findById(id)
      .populate('author', 'username')
      .populate('dislikers.userId', 'username');

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Erreur lors du dislike du post:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

