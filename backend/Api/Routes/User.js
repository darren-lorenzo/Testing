const expr = require('express');
const UserRoute = require('../../Api/Controllers/user.controler')
const route = expr.Router();

route.get('/', UserRoute.getAllUser);
route.get('/:id', UserRoute.getUserById);
route.put('/:id', UserRoute.UpdateUser);
route.post('/', UserRoute.createUser);
route.delete('/:id', UserRoute.deleteUser);

module.exports = route;
