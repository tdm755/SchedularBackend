const passport = require('../config/passport.config');
const { generateResponse } = require('../utils/responseUtils');

exports.verifyTokenAndSession = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return generateResponse(res, 401, 'Unauthorized');
    }
    req.user = user;
    next();
  })(req, res, next);
};

exports.adminCheckAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    generateResponse(res, 403, 'Access denied. Admin only.');
  }
};

exports.userCheckAuth = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    generateResponse(res, 403, 'Access denied. User only.');
  }
};