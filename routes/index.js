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

module.exports = router;