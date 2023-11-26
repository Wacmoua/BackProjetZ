const express = require("express");
const session = require("express-session");
const connectDB = require("./backend/config/db");
const cors = require("cors");
const dotenv = require("dotenv").config();
const jwt = require('jsonwebtoken');

// Connexion à la DB
connectDB();

const app = express();

// Middleware CORS
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de session
app.use(
  session({
    secret: "votre_secret_session",
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
  // Récupérer le token du header de la requête
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token non fourni. Accès non autorisé.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erreur lors de la vérification du token:", err); // Ajout pour le débogage
      return res.status(401).json({ message: 'Token non valide. Accès non autorisé.' });
    }

    // Stocker l'ID utilisateur dans la requête pour une utilisation ultérieure
    req.userId = decoded.userId;
    next(); // Continuer vers la prochaine étape du middleware
  });
};
// Routes
app.use("/post", require("./backend/routes/post.routes"));
app.use("/auth", require("./backend/routes/auth.routes"));
app.use('/route-protegee', verifyToken, require('./routes/routeProtegee.routes'));

module.exports = app;

