const expr = require('express');
const AreasRoute = require('../../Api/Controllers/Area')
const route = expr.Router();

route.get('/', AreasRoute.getArea);
route.get('/user/:id', AreasRoute.getAreasByUser);
route.get('/:id', AreasRoute.getAreaById);
route.put('/:id', AreasRoute.updateArea);
route.post('/', AreasRoute.createArea);
route.delete('/:id', AreasRoute.deleteArea);
route.get("/service/:service", AreasRoute.getAreasByService);

module.exports = route;