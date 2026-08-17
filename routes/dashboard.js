const express = require('express');
const reservationsService = require('../services/reservations');
const catwaysService = require('../services/catways');
const usersService = require('../services/users');

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

/**
 * GET /dashboard/reservations
 * Affiche la page de gestion des réservations.
 */
router.get('/reservations', async (req, res) => {
  try {
    const [reservations, catways] = await Promise.all([
      reservationsService.getAllReservations(),
      catwaysService.getAllCatways()
    ]);

    return res.render('reservations', {
      user: req.user,
      reservations,
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
 * POST /dashboard/reservations
 * Crée une réservation depuis l’interface.
 */
router.post('/reservations', async (req, res) => {
  try {
    await reservationsService.createReservation(
      Number(req.body.catwayNumber),
      req.body
    );

    return res.redirect('/dashboard/reservations');
  } catch (error) {
    return res.redirect(
      `/dashboard/reservations?error=${encodeURIComponent(error.message)}`
    );
  }
});

/**
 * POST /dashboard/reservations/:id/update
 * Modifie une réservation depuis l’interface.
 */
router.post('/reservations/:id/update', async (req, res) => {
  try {
    await reservationsService.updateReservation(
      Number(req.body.catwayNumber),
      req.params.id,
      req.body
    );

    return res.redirect('/dashboard/reservations');
  } catch (error) {
    return res.redirect(
      `/dashboard/reservations?error=${encodeURIComponent(error.message)}`
    );
  }
});

/**
 * POST /dashboard/reservations/:id/delete
 * Supprime une réservation depuis l’interface.
 */
router.post('/reservations/:id/delete', async (req, res) => {
  try {
    await reservationsService.deleteReservation(
      Number(req.body.catwayNumber),
      req.params.id
    );

    return res.redirect('/dashboard/reservations');
  } catch (error) {
    return res.redirect(
      `/dashboard/reservations?error=${encodeURIComponent(error.message)}`
    );
  }
});

/**
 * GET /dashboard/users
 * Affiche la page de gestion des utilisateurs.
 */
router.get('/users', async (req, res) => {
  try {
    const users = await usersService.getAllUsers();

    return res.render('users', {
      currentUser: req.user,
      users,
      error: req.query.error || null
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur interne du serveur.'
    });
  }
});

/**
 * POST /dashboard/users
 * Crée un utilisateur depuis l’interface.
 */
router.post('/users', async (req, res) => {
  try {
    await usersService.createUser(req.body);
    return res.redirect('/dashboard/users');
  } catch (error) {
    const message =
      error.code === 11000
        ? 'Cette adresse email est déjà utilisée.'
        : error.message;

    return res.redirect(
      `/dashboard/users?error=${encodeURIComponent(message)}`
    );
  }
});

/**
 * POST /dashboard/users/:email/update
 * Modifie un utilisateur depuis l’interface.
 */
router.post('/users/:email/update', async (req, res) => {
  try {
    await usersService.updateUser(req.params.email, req.body);
    return res.redirect('/dashboard/users');
  } catch (error) {
    const message =
      error.code === 11000
        ? 'Cette adresse email est déjà utilisée.'
        : error.message;

    return res.redirect(
      `/dashboard/users?error=${encodeURIComponent(message)}`
    );
  }
});

/**
 * POST /dashboard/users/:email/delete
 * Supprime un utilisateur depuis l’interface.
 */
router.post('/users/:email/delete', async (req, res) => {
  try {
    if (req.params.email === req.user.email) {
      return res.redirect(
        '/dashboard/users?error=' +
        encodeURIComponent(
          'Vous ne pouvez pas supprimer votre propre compte.'
        )
      );
    }

    await usersService.deleteUser(req.params.email);
    return res.redirect('/dashboard/users');
  } catch (error) {
    return res.redirect(
      `/dashboard/users?error=${encodeURIComponent(error.message)}`
    );
  }
});

module.exports = router;