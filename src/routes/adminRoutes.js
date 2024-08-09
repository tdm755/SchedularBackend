const express = require('express');
const router = express.Router();
const { loginAdmin, logoutAdmin } = require('../controllers/adminAuthController');
const { verifyTokenAndSession, adminCheckAuth } = require('../middlewares/authMiddleware');

router.post('/login', loginAdmin);
router.post('/logout', verifyTokenAndSession, adminCheckAuth, logoutAdmin);

module.exports = router;