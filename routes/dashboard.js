const express = require('express');
const reservationsService = require('../services/reservations');

const router = express.Router();

/**
 * GET /dashboard
 * Affiche le tableau de bord de l’utilisateur connecté.
 */
router.get('/', async (req, res) => {
  try {
    const reservations =
      await reservationsService.getCurrentReservations();

    return res.render('dashboard', {
      user: req.user,
      currentDate: new Date(),
      reservations
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur interne du serveur.'
    });
  }
});

module.exports = router;