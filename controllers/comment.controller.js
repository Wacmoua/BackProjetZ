// Importez le modèle de commentaire
const CommentModel = require('../models/comment.model');

// Fonction pour ajouter un commentaire
module.exports.addComment = async (req, res) => {
  try {
    // Vérifiez si le message du commentaire est présent dans la requête
    if (!req.body.message) {
      res.status(400).json({ message: "Merci d'ajouter un message au commentaire" });
      return;
    }

    // Recherchez l'utilisateur dans la base de données (si nécessaire)
    // const user = await UserModel.findById(req.userId);

    // Si l'utilisateur n'est pas trouvé, vous pouvez choisir de renvoyer une erreur 404
    // ou de créer un nouvel utilisateur, selon votre logique métier

    // Créez le commentaire avec le message et l'auteur (par exemple, l'ID de l'utilisateur)
    const comment = await CommentModel.create({
      message: req.body.message,
      author: req.userId, // Remplacez par la logique réelle pour déterminer l'auteur
      // Vous pouvez également ajouter d'autres champs comme la date de création, les likes, etc.
    });

    res.status(200).json(comment);
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    res.status(500).json({ message: "Erreur lors de la création du commentaire" });
  }
};

// Autres fonctions de gestion des commentaires peuvent être ajoutées ici
// Par exemple, récupérer tous les commentaires d'un post, supprimer un commentaire, etc.
