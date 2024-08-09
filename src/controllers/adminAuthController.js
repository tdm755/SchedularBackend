const Admin = require('../models/AdminModel');
const passport = require('passport');
const { generateToken, setAdminTokenCookie } = require('../utils/jwtHelper');
const { generateResponse } = require('../utils/responseUtils');

exports.loginAdmin = (req, res, next) => {
  passport.authenticate('admin-local', (err, admin, info) => {
    if (err) {
      return next(err);
    }
    if (!admin) {
      return generateResponse(res, 401, info.message);
    }
    req.logIn(admin, (err) => {
      if (err) {
        return next(err);
      }
      const rememberMe = req.body.rememberMe === 'true';
      const token = generateToken({ id: admin.id, role: 'admin' }, rememberMe);
      setAdminTokenCookie(res, token, rememberMe);
      generateResponse(res, 200, 'Admin logged in successfully', { admin: { id: admin.id, email: admin.email } });
    });
  })(req, res, next);
};

exports.logoutAdmin = (req, res) => {
  req.logout((err) => {
    if (err) {
      return generateResponse(res, 500, 'Error logging out', null, err.message);
    }
    res.clearCookie(process.env.ADMIN_COOKIE);
    generateResponse(res, 200, 'Admin logged out successfully');
  });
};