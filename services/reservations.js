const Reservation = require('../models/reservation');

/**
 * Récupère toutes les réservations d’un catway.
 * @param {number} catwayNumber
 * @returns {Promise<Array>}
 */
exports.getReservationsByCatway = async (catwayNumber) =>
  Reservation.find({ catwayNumber });

/**
 * Récupère une réservation précise d’un catway.
 * @param {number} catwayNumber
 * @param {string} reservationId
 * @returns {Promise<Object|null>}
 */
exports.getReservationById = async (catwayNumber, reservationId) =>
  Reservation.findOne({
    _id: reservationId,
    catwayNumber
  });

/**
 * Crée une réservation pour un catway.
 * @param {number} catwayNumber
 * @param {Object} data
 * @returns {Promise<Object>}
 */
exports.createReservation = async (catwayNumber, data) =>
  Reservation.create({
    ...data,
    catwayNumber
  });

/**
 * Modifie une réservation existante.
 * @param {number} catwayNumber
 * @param {string} reservationId
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
exports.updateReservation = async (
  catwayNumber,
  reservationId,
  data
) => {
  const allowedData = {
    clientName: data.clientName,
    boatName: data.boatName,
    startDate: data.startDate,
    endDate: data.endDate
  };

  return Reservation.findOneAndUpdate(
    {
      _id: reservationId,
      catwayNumber
    },
    allowedData,
    {
      new: true,
      runValidators: true
    }
  );
};

/**
 * Supprime une réservation.
 * @param {number} catwayNumber
 * @param {string} reservationId
 * @returns {Promise<Object|null>}
 */
exports.deleteReservation = async (catwayNumber, reservationId) =>
  Reservation.findOneAndDelete({
    _id: reservationId,
    catwayNumber
  });