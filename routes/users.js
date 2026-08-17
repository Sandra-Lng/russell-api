const express = require('express');
const usersService = require('../services/users');

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Vérifie le format d’une adresse email.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return typeof email === 'string' && emailPattern.test(email);
}

/**
 * GET /users
 * Récupère tous les utilisateurs.
 */
router.get('/', async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * GET /users/:email
 * Récupère un utilisateur grâce à son email.
 */
router.get('/:email', async (req, res) => {
  try {
    if (!isValidEmail(req.params.email)) {
      return res.status(400).json({ message: 'Adresse email invalide.' });
    }

    const user = await usersService.getUserByEmail(req.params.email);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * POST /users
 * Crée un utilisateur.
 */
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (typeof username !== 'string' || username.trim().length < 2) {
      return res.status(400).json({
        message: 'Le nom d’utilisateur doit contenir au moins 2 caractères.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Adresse email invalide.' });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères.'
      });
    }

    const user = await usersService.createUser({
      username,
      email,
      password
    });

    return res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Cette adresse email est déjà utilisée.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * PUT /users/:email
 * Modifie un utilisateur.
 */
router.put('/:email', async (req, res) => {
  try {
    if (!isValidEmail(req.params.email)) {
      return res.status(400).json({ message: 'Adresse email invalide.' });
    }

    if (req.body.email !== undefined && !isValidEmail(req.body.email)) {
      return res.status(400).json({ message: 'Nouvelle adresse email invalide.' });
    }

    if (
      req.body.password !== undefined &&
      req.body.password !== '' &&
      req.body.password.length < 8
    ) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères.'
      });
    }

    const user = await usersService.updateUser(
      req.params.email,
      req.body
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Cette adresse email est déjà utilisée.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * DELETE /users/:email
 * Supprime un utilisateur.
 */
router.delete('/:email', async (req, res) => {
  try {
    if (!isValidEmail(req.params.email)) {
      return res.status(400).json({ message: 'Adresse email invalide.' });
    }

    const user = await usersService.deleteUser(req.params.email);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    return res.status(200).json({
      message: 'Utilisateur supprimé avec succès.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;