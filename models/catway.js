const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Schéma représentant un catway du port.
 */
const catwaySchema = new Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1
  },
  catwayType: {
    type: String,
    required: true,
    enum: ['long', 'short']
  },
  catwayState: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Catway', catwaySchema);