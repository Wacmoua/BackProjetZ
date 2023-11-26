const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");



const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifiez si l'utilisateur existe déjà
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

    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Vérifiez le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Ici, vous pouvez générer un jeton d'authentification si nécessaire
    // et le renvoyer au client.
    const token = jwt.sign({ sub: user._id }, 'secretkey', { expiresIn: '48h' });



    res.status(200).json({ message: "Connexion réussie.", user, token });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};




module.exports = {
  registerUser,
  loginUser,
};
