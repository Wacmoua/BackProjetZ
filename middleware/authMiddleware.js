const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const tokenHeader = req.header("Authorization");

    if (!tokenHeader) {
        return res.status(401).json({ message: "Token d'utilisateur manquant." });
    }

    // Assurez-vous que le token est précédé par "Bearer " avec l'espace
    const token = tokenHeader.replace("Bearer ", "");
    

    try {
        const decodedToken = jwt.verify(token, 'secretkey');


        // Assurez-vous que "user" est défini dans le token
        if (!decodedToken.sub) {
            return res.status(401).json({ message: "Informations utilisateur manquantes dans le token." });
        }

        // Ajoutez un log pour afficher le userId extrait du token
        console.log("User ID from token:", decodedToken.sub);
        

        req.userId = decodedToken.sub;
        next();
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        res.status(401).json({ message: "Token d'utilisateur invalide." });
    }
};

module.exports = { authenticateUser };
