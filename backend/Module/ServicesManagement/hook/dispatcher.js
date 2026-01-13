module.exports = {
    async runAction(action, userConfig, Params) {
        const service = action.Service.service;
        const type = action.Service.type;

        try {
            const module = require(`../${service}/${type}.js`);
            return await module(Params, userConfig);
        } catch (err) {
            console.error("[HOOK] Action error:", err);
            throw err;
        }
    },

    async runReaction(reaction, payload, userConfig, Params) {
        //console.log('LINKEDIN REACTION CALLED', Params);
        const service = reaction.Service.service;    
        const type = reaction.Service.type;

        try {
            const module = require(`../${service}/${type}.js`);
            return await module(Params, payload, userConfig);
        } catch (err) {
            console.error("[HOOK] Reaction error:", err);
            throw err;
        }
    }
};
