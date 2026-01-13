const express = require("express");
const router = express.Router();

router.get("/about.json", async (req, res) => {
    try {
        const clientIP =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.ip;

        const Services = global.Services;
        const Actions = global.Actions;
        const Reactions = global.Reactions;

        const servicesData = await Services.findAll();
        
        const services = await Promise.all(
            servicesData.map(async (service) => {
                const serviceId = service.id;
                const serviceName = service.name;

                const actions = await Actions.findAll({
                    where: { service_id: serviceId }
                });

                const reactions = await Reactions.findAll({
                    where: { service_id: serviceId }
                });

                const formattedActions = actions.map(action => ({
                    name: action.name,
                    description: action.description || ""
                }));

                const formattedReactions = reactions.map(reaction => ({
                    name: reaction.name,
                    description: reaction.description || ""
                }));

                return {
                    name: serviceName,
                    actions: formattedActions,
                    reactions: formattedReactions
                };
            })
        );

        const response = {
            client: {
                host: clientIP
            },
            server: {
                current_time: Math.floor(Date.now() / 1000),
                services: services
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Error in about.json route:', error);
        res.status(500).json({
            error: 'Failed to fetch about information',
            message: error.message
        });
    }
});

module.exports = router;
