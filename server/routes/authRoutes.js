const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);

module.exports = router;
