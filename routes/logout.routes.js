const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

// Endpoint de déconnexion
router.post("/logout", authenticateUser, (req, res) => {
    // Code de déconnexion ici (par exemple, invalider le token côté serveur)
    // ...

    res.status(200).json({ message: "Déconnexion réussie" });
});

// Exportez le routeur
module.exports = router;