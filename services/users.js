const bcrypt = require('bcrypt');
const User = require('../models/user');

/**
 * Récupère tous les utilisateurs sans leur mot de passe.
 * @returns {Promise<Array>}
 */
exports.getAllUsers = async () => User.find();

/**
 * Récupère un utilisateur grâce à son adresse email.
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
exports.getUserByEmail = async (email) =>
  User.findOne({ email: email.toLowerCase() });

/**
 * Crée un utilisateur.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
exports.createUser = async (data) => User.create(data);

/**
 * Modifie un utilisateur.
 * @param {string} currentEmail
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
exports.updateUser = async (currentEmail, data) => {
  const user = await User.findOne({
    email: currentEmail.toLowerCase()
  });

  if (!user) {
    return null;
  }

  if (data.username !== undefined) {
    user.username = data.username;
  }

  if (data.email !== undefined) {
    user.email = data.email;
  }

  if (data.password !== undefined && data.password !== '') {
    user.password = data.password;
  }

  await user.save();
  user.password = undefined;

  return user;
};

/**
 * Supprime un utilisateur.
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
exports.deleteUser = async (email) =>
  User.findOneAndDelete({ email: email.toLowerCase() });

/**
 * Vérifie les identifiants de connexion.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object|null>}
 */
exports.authenticateUser = async (email, password) => {
  const user = await User.findOne({
    email: email.toLowerCase()
  }).select('+password');

  if (!user) {
    return null;
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    return null;
  }

  return user;
};