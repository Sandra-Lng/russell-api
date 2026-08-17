const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Schéma représentant la réservation d'un catway.
 */
const reservationSchema = new Schema({
  catwayNumber: {
    type: Number,
    required: true,
    min: 1
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  boatName: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator(value) {
        return !this.startDate || value > this.startDate;
      },
      message: 'La date de fin doit être postérieure à la date de début.'
    }
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);