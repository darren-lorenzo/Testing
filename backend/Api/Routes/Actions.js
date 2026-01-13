const expr = require('express');
const ActionRoute = require('../../Api/Controllers/Action')
const route = expr.Router();

route.get('/', ActionRoute.getAction);
route.get('/id/:id', ActionRoute.getActionById);
route.get('/name/:name', ActionRoute.getActionByName);
route.put('/:id', ActionRoute.updateAction);
route.post('/', ActionRoute.createAction);
route.delete('/:id', ActionRoute.deleteAction);

module.exports = route;