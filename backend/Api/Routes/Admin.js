const expr = require('express');
const AdminsRoute = require('../Controllers/Admin')
const route = expr.Router();

route.get('/', AdminsRoute.getAllAdmin);
route.get('/:id', AdminsRoute.getAdminById);
route.put('/:id', AdminsRoute.UpdateAdmin);
route.post('/', AdminsRoute.createAdmin);
route.delete('/:id', AdminsRoute.deleteAdmin);

module.exports = route;