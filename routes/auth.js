const express = require('express');
const jwt = require('jsonwebtoken');
const usersService = require('../services/users');

const router = express.Router();

/**
 * POST /login
 * Connecte un utilisateur et génère un token JWT.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: 'L’adresse email et le mot de passe sont obligatoires.'
      });
    }

    const user = await usersService.authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({
        message: 'Adresse email ou mot de passe incorrect.'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '24h'
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.set('Authorization', `Bearer ${token}`);

    return res.status(200).json({
      message: 'Connexion réussie.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur interne du serveur.'
    });
  }
});

/**
 * GET /logout
 * Déconnecte l’utilisateur en supprimant son cookie.
 */
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    message: 'Déconnexion réussie.'
  });
});

module.exports = router;