const jwt = require('jsonwebtoken');

/**
 * Vérifie le token JWT envoyé par cookie ou dans le header Authorization.
 */
module.exports = function checkJWT(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  let token = req.cookies.token;

  if (
    !token &&
    authorizationHeader &&
    authorizationHeader.startsWith('Bearer ')
  ) {
    token = authorizationHeader.slice(7);
  }

  if (!token) {
    return res.status(401).json({
      message: 'Authentification requise.'
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token invalide ou expiré.'
    });
  }
};