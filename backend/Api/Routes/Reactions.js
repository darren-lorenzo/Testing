const expr = require('express');
const ReactionstionRoute = require('../../Api/Controllers/Reaction')
const route = expr.Router();

route.get('/', ReactionstionRoute.getReaction);
route.get('/:id', ReactionstionRoute.getReactionById);
route.get('/name/:name', ReactionstionRoute.getReactionByName);
route.put('/:id', ReactionstionRoute.updateReaction);
route.post('/', ReactionstionRoute.createReaction);
route.delete('/:id', ReactionstionRoute.deleteReaction);

module.exports = route;