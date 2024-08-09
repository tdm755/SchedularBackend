const User = require('../models/UserModel');
const passport = require('passport');
const { generateToken, setTokenCookie } = require('../utils/jwtHelper');
const { generateResponse } = require('../utils/responseUtils');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = generateToken({ id: user.id, role: 'user' });
    setTokenCookie(res, token);
    generateResponse(res, 201, 'User registered successfully', { user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    generateResponse(res, 500, 'Error registering user', null, error.message);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('user-local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return generateResponse(res, 401, info.message);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const rememberMe = req.body.rememberMe === 'true';
      const token = generateToken({ id: user.id, role: 'user' }, rememberMe);
      setTokenCookie(res, token, rememberMe);
      generateResponse(res, 200, 'Logged in successfully', { user: { id: user.id, username: user.username, email: user.email } });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return generateResponse(res, 500, 'Error logging out', null, err.message);
    }
    res.clearCookie(process.env.USER_COOKIE);
    generateResponse(res, 200, 'Logged out successfully');
  });
};