// config/passport.config.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const Admin = require('../models/AdminModel');

passport.use('user-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use('admin-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return done(null, false, { message: 'Admin not found' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }
    return done(null, admin);
  } catch (error) {
    return done(error);
  }
}));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => {
      if (req && req.cookies) {
        return req.cookies[process.env.USER_COOKIE] || req.cookies[process.env.ADMIN_COOKIE];
      }
      return null;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    let user;
    if (payload.role === 'admin') {
      user = await Admin.findByPk(payload.id);
    } else {
      user = await User.findByPk(payload.id);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user instanceof Admin ? 'admin' : 'user' });
  });
  
  passport.deserializeUser(async (serializedUser, done) => {
    try {
      let user;
      if (serializedUser.role === 'admin') {
        user = await Admin.findByPk(serializedUser.id);
      } else {
        user = await User.findByPk(serializedUser.id);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

module.exports = passport;