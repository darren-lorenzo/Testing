const express = require('express');
const router = express.Router();
const Login = require('../../Controllers/Authentification/login.js');

router.post('/', Login.login);

module.exports = router;