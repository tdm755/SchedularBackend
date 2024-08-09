const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const sequelize = require('./src/config/db.config');
const passport = require('./src/config/passport.config');

const adminAuthRoutes = require('./src/routes/adminRoutes');
const userAuthRoutes = require('./src/routes/userRoutes');

const app = express();

app.use(cors({
  origin: [process.env.USER_BASE_URL, process.env.ADMIN_BASE_URL],
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN)
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/admin', adminAuthRoutes);
app.use('/api/user', userAuthRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Admin endpoints: ${BASE_URL}/api/admin`);
      console.log(`User endpoints: ${BASE_URL}/api/user`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });