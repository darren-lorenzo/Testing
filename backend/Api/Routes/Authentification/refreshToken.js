const express = require('express');
const router = express.Router();
const refreshTokenController = require('../../Controllers/Authentification/refreshToken');

router.post('/', refreshTokenController.refreshToken);

module.exports = router;
