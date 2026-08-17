const express = require('express');
const mongoose = require('mongoose');
const reservationsService = require('../services/reservations');
const catwaysService = require('../services/catways');

const router = express.Router({ mergeParams: true });

/**
 * Convertit et vérifie le numéro du catway présent dans l’URL.
 * @param {string} value
 * @returns {number|null}
 */
function parseCatwayNumber(value) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return null;
  }

  return number;
}

/**
 * Vérifie les données d’une réservation.
 * @param {Object} data
 * @returns {string|null}
 */
function validateReservationData(data) {
  if (typeof data.clientName !== 'string' || data.clientName.trim() === '') {
    return 'Le nom du client est obligatoire.';
  }

  if (typeof data.boatName !== 'string' || data.boatName.trim() === '') {
    return 'Le nom du bateau est obligatoire.';
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Les dates de réservation sont invalides.';
  }

  if (endDate <= startDate) {
    return 'La date de fin doit être postérieure à la date de début.';
  }

  return null;
}

/**
 * Vérifie que le catway existe.
 * @param {number} catwayNumber
 * @returns {Promise<boolean>}
 */
async function catwayExists(catwayNumber) {
  const catway = await catwaysService.getCatwayByNumber(catwayNumber);
  return Boolean(catway);
}

/**
 * GET /catways/:id/reservations
 * Liste les réservations du catway.
 */
router.get('/', async (req, res) => {
  try {
    const catwayNumber = parseCatwayNumber(req.params.id);

    if (catwayNumber === null) {
      return res.status(400).json({ message: 'Numéro de catway invalide.' });
    }

    if (!(await catwayExists(catwayNumber))) {
      return res.status(404).json({ message: 'Catway introuvable.' });
    }

    const reservations =
      await reservationsService.getReservationsByCatway(catwayNumber);

    return res.status(200).json(reservations);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * GET /catways/:id/reservations/:idReservation
 * Affiche une réservation précise.
 */
router.get('/:idReservation', async (req, res) => {
  try {
    const catwayNumber = parseCatwayNumber(req.params.id);

    if (catwayNumber === null) {
      return res.status(400).json({ message: 'Numéro de catway invalide.' });
    }

    if (!mongoose.isValidObjectId(req.params.idReservation)) {
      return res.status(400).json({ message: 'Identifiant invalide.' });
    }

    const reservation = await reservationsService.getReservationById(
      catwayNumber,
      req.params.idReservation
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable.' });
    }

    return res.status(200).json(reservation);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * POST /catways/:id/reservations
 * Crée une réservation.
 */
router.post('/', async (req, res) => {
  try {
    const catwayNumber = parseCatwayNumber(req.params.id);

    if (catwayNumber === null) {
      return res.status(400).json({ message: 'Numéro de catway invalide.' });
    }

    if (!(await catwayExists(catwayNumber))) {
      return res.status(404).json({ message: 'Catway introuvable.' });
    }

    const validationMessage = validateReservationData(req.body);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const reservation = await reservationsService.createReservation(
      catwayNumber,
      req.body
    );

    return res.status(201).json(reservation);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * PUT /catways/:id/reservations/:idReservation
 * Modifie une réservation.
 */
router.put('/:idReservation', async (req, res) => {
  try {
    const catwayNumber = parseCatwayNumber(req.params.id);

    if (catwayNumber === null) {
      return res.status(400).json({ message: 'Numéro de catway invalide.' });
    }

    if (!mongoose.isValidObjectId(req.params.idReservation)) {
      return res.status(400).json({ message: 'Identifiant invalide.' });
    }

    const validationMessage = validateReservationData(req.body);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const reservation = await reservationsService.updateReservation(
      catwayNumber,
      req.params.idReservation,
      req.body
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable.' });
    }

    return res.status(200).json(reservation);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * DELETE /catways/:id/reservations/:idReservation
 * Supprime une réservation.
 */
router.delete('/:idReservation', async (req, res) => {
  try {
    const catwayNumber = parseCatwayNumber(req.params.id);

    if (catwayNumber === null) {
      return res.status(400).json({ message: 'Numéro de catway invalide.' });
    }

    if (!mongoose.isValidObjectId(req.params.idReservation)) {
      return res.status(400).json({ message: 'Identifiant invalide.' });
    }

    const reservation = await reservationsService.deleteReservation(
      catwayNumber,
      req.params.idReservation
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable.' });
    }

    return res.status(200).json({
      message: 'Réservation supprimée avec succès.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;