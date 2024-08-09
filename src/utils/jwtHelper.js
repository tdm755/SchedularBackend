const jwt = require('jsonwebtoken');

exports.generateToken = (payload, rememberMe = false) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? process.env.JWT_REMEMBER_ME_EXPIRES_IN : process.env.JWT_EXPIRES_IN
  });
};

exports.setTokenCookie = (res, token, rememberMe = false) => {
  const cookieName = process.env.USER_COOKIE;
  const cookieOptions = {
    expires: new Date(
      Date.now() + (rememberMe ? process.env.JWT_REMEMBER_ME_COOKIE_EXPIRES_IN : process.env.JWT_COOKIE_EXPIRES_IN) * 1
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.COOKIE_DOMAIN
  };
  res.cookie(cookieName, token, cookieOptions);
};

exports.setAdminTokenCookie = (res, token, rememberMe = false) => {
  const cookieName = process.env.ADMIN_COOKIE;
  const cookieOptions = {
    expires: new Date(
      Date.now() + (rememberMe ? process.env.JWT_REMEMBER_ME_COOKIE_EXPIRES_IN : process.env.JWT_COOKIE_EXPIRES_IN) * 1
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.COOKIE_DOMAIN
  };
  res.cookie(cookieName, token, cookieOptions);
};