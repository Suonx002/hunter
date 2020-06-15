const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');

// register user
router.post('/register', authValidator.checkRegister, authController.register);

//login user
router.post('/login', authValidator.checkLogin, authController.login);

module.exports = router;
