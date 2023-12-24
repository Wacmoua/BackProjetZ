const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const Post = require("../models/post.model");



const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Utilisateur enregistré avec succès.", user: newUser });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Vérifie le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    
    const token = jwt.sign({ sub: user._id }, 'secretkey', { expiresIn: '48h' });



    res.status(200).json({ message: "Connexion réussie.", user, token });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.userId;

  try {
    // Trouve tous les posts de l'utilisateur
    const userPosts = await Post.find({ author: userId });

    await Post.updateMany(
      { likers: { $elemMatch: { userId: userId } } },
      { $pull: { likers: { userId: userId } } }
    );
    await Post.updateMany(
      { dislikers: { $elemMatch: { userId: userId } } },
      { $pull: { dislikers: { userId: userId } } }
    );
    // Supprime ces posts
    await Promise.all(userPosts.map(async (post) => {
      await Post.findByIdAndDelete(post._id);
    }));

   

    // Supprime l'utilisateur de la base de données
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.userId; 
  const { username, newPassword } = req.body;

  try {
    // Vérifie si le nouvel utilisateur existe déjà 
    const existingUser = await User.findOne({ username });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ error: "Ce nom d'utilisateur est déjà pris." });
    }

    // Mise à jour le nom d'utilisateur et/ou le mot de passe
    const updatedUser = {};

    if (username) {
      console.log("Updating username to:", username);
      updatedUser.username = username;
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedUser.password = hashedPassword;
    }

    await User.findByIdAndUpdate(userId, updatedUser);

    res.status(200).json({ message: "Profil mis à jour avec succès." });
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  deleteAccount,
  updateProfile,
};






