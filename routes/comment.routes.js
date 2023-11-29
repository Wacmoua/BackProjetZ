// routes/comment.js

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment.model');

// Endpoint pour créer un commentaire
router.post('/', async (req, res) => {
  try {
    const { text, postId } = req.body;

    // Créer un nouveau commentaire
    const newComment = new Comment({
      text,
      postId,
    });

    // Sauvegarder le commentaire dans la base de données
    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Erreur lors de la création du commentaire :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
