const path = require('path');
const express = require("express");
const session = require("express-session");
const connectDB = require("../backend/config/db");
const app = express();
const postRoutes = require("./routes/post.routes");
const authRoutes = require("./routes/auth.routes");
const logoutRoutes = require("./routes/logout.routes");
const bodyParser = require("body-parser");

require('dotenv').config();

// Middleware Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connexion à la base de données
connectDB();

// Middleware CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware de session
app.use(
  session({
    secret: "votre_secret_session",
    resave: true,
    saveUninitialized: true,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/logout", logoutRoutes);


const staticFolderPath = path.resolve(__dirname, '../Front test');
console.log("Chemin absolu du dossier statique:", staticFolderPath);

app.use(express.static(staticFolderPath));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
