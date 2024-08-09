const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
const { verifyTokenAndSession, userCheckAuth } = require('../middlewares/authMiddleware');

router.post('/register', userAuthController.register);
router.post('/login', userAuthController.login);
router.post('/logout', verifyTokenAndSession, userCheckAuth, userAuthController.logout);

module.exports = router;