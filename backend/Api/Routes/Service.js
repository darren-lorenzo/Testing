const expr = require('express');
const ServiceRoute = require('../../Api/Controllers/Service')
const route = expr.Router();

route.get('/', ServiceRoute.getService);
route.get('/:id', ServiceRoute.getServiceById);
route.put('/:id', ServiceRoute.updateService);
route.post('/', ServiceRoute.createService);
route.delete('/:id', ServiceRoute.deleteService);

module.exports = route;