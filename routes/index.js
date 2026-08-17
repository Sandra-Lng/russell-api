const express = require('express');

const router = express.Router();

/**
 * GET /
 * Affiche la page d’accueil et le formulaire de connexion.
 */
router.get('/', (req, res) => {
  return res.render('index', {
    error: null
  });
});

/**
 * GET /api-docs
 * Affiche la documentation de l’API.
 */
router.get('/api-docs', (req, res) => {
  return res.render('api-docs');
});

module.exports = router;