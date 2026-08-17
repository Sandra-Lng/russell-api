const express = require('express');
const reservationsService = require('../services/reservations');
const catwaysService = require('../services/catways');

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
/**
 * GET /dashboard/catways
 * Affiche la page de gestion des catways.
 */
router.get('/catways', async (req, res) => {
  try {
    const catways = await catwaysService.getAllCatways();

    return res.render('catways', {
      user: req.user,
      catways,
      error: req.query.error || null
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur interne du serveur.'
    });
  }
});

/**
 * POST /dashboard/catways
 * Crée un catway depuis l’interface.
 */
router.post('/catways', async (req, res) => {
  try {
    await catwaysService.createCatway(req.body);
    return res.redirect('/dashboard/catways');
  } catch (error) {
    const message =
      error.code === 11000
        ? 'Ce numéro de catway existe déjà.'
        : error.message;

    return res.redirect(
      `/dashboard/catways?error=${encodeURIComponent(message)}`
    );
  }
});

/**
 * POST /dashboard/catways/:id/update
 * Modifie l’état d’un catway depuis l’interface.
 */
router.post('/catways/:id/update', async (req, res) => {
  try {
    await catwaysService.updateCatwayState(
      Number(req.params.id),
      req.body.catwayState
    );

    return res.redirect('/dashboard/catways');
  } catch (error) {
    return res.redirect(
      `/dashboard/catways?error=${encodeURIComponent(error.message)}`
    );
  }
});

/**
 * POST /dashboard/catways/:id/delete
 * Supprime un catway depuis l’interface.
 */
router.post('/catways/:id/delete', async (req, res) => {
  try {
    await catwaysService.deleteCatway(Number(req.params.id));
    return res.redirect('/dashboard/catways');
  } catch (error) {
    return res.redirect(
      `/dashboard/catways?error=${encodeURIComponent(error.message)}`
    );
  }
});

module.exports = router;