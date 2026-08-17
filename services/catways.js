const Catway = require('../models/catway');

/**
 * Récupère tous les catways.
 * @returns {Promise<Array>}
 */
exports.getAllCatways = async () => Catway.find();

/**
 * Récupère un catway grâce à son numéro.
 * @param {number} catwayNumber
 * @returns {Promise<Object|null>}
 */
exports.getCatwayByNumber = async (catwayNumber) =>
  Catway.findOne({ catwayNumber });

/**
 * Crée un nouveau catway.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
exports.createCatway = async (data) => Catway.create(data);

/**
 * Modifie uniquement l’état d’un catway.
 * @param {number} catwayNumber
 * @param {string} catwayState
 * @returns {Promise<Object|null>}
 */
exports.updateCatwayState = async (catwayNumber, catwayState) =>
  Catway.findOneAndUpdate(
    { catwayNumber },
    { catwayState },
    {
      new: true,
      runValidators: true
    }
  );

/**
 * Supprime un catway.
 * @param {number} catwayNumber
 * @returns {Promise<Object|null>}
 */
exports.deleteCatway = async (catwayNumber) =>
  Catway.findOneAndDelete({ catwayNumber });