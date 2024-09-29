
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, logout,me } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// router.post('/me', me);
router.get('/me', auth, me);


module.exports = router;
