const expr = require('express');
const route = expr.Router();
const reg = require('../../Controllers/Authentification/register')

route.post('/', reg.register);

module.exports = route;