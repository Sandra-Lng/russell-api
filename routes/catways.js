const express = require('express');
const catwaysService = require('../services/catways');

const router = express.Router();

/**
 * Convertit et vérifie un numéro de catway.
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
 * GET /catways
 * Récupère tous les catways.
 */
router.get('/', async (req, res) => {
  try {
    const catways = await catwaysService.getAllCatways();
    return res.status(200).json(catways);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * GET /catways/:id
 * Récupère un catway grâce à son numéro.
 */
router.get('/:id', async (req, res) => {
  try {
    const catwayNumber = parseCatwayNumber(req.params.id);

    if (catwayNumber === null) {
      return res.status(400).json({ message: 'Numéro de catway invalide.' });
    }

    const catway = await catwaysService.getCatwayByNumber(catwayNumber);

    if (!catway) {
      return res.status(404).json({ message: 'Catway introuvable.' });
    }

    return res.status(200).json(catway);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * POST /catways
 * Crée un nouveau catway.
 */
router.post('/', async (req, res) => {
  try {
    const catway = await catwaysService.createCatway(req.body);
    return res.status(201).json(catway);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Ce numéro de catway existe déjà.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * PUT /catways/:id
 * Modifie uniquement l’état d’un catway.
 */
router.put('/:id', async (req, res) => {
  try {
    const catwayNumber = parseCatwayNumber(req.params.id);

    if (catwayNumber === null) {
      return res.status(400).json({ message: 'Numéro de catway invalide.' });
    }

    if (
      typeof req.body.catwayState !== 'string' ||
      req.body.catwayState.trim() === ''
    ) {
      return res.status(400).json({
        message: 'Le nouvel état du catway est obligatoire.'
      });
    }

    const catway = await catwaysService.updateCatwayState(
      catwayNumber,
      req.body.catwayState
    );

    if (!catway) {
      return res.status(404).json({ message: 'Catway introuvable.' });
    }

    return res.status(200).json(catway);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

/**
 * DELETE /catways/:id
 * Supprime un catway.
 */
router.delete('/:id', async (req, res) => {
  try {
    const catwayNumber = parseCatwayNumber(req.params.id);

    if (catwayNumber === null) {
      return res.status(400).json({ message: 'Numéro de catway invalide.' });
    }

    const catway = await catwaysService.deleteCatway(catwayNumber);

    if (!catway) {
      return res.status(404).json({ message: 'Catway introuvable.' });
    }

    return res.status(200).json({
      message: 'Catway supprimé avec succès.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;