const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

/**
 * Schéma représentant un utilisateur de la capitainerie.
 */
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Adresse email invalide.']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  }
});

/**
 * Retire le mot de passe lors de la conversion en JSON.
 */
userSchema.set('toJSON', {
  transform(document, returnedObject) {
    delete returnedObject.password;
    return returnedObject;
  }
});
/**
 * Hache le mot de passe avant son enregistrement.
 */
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);