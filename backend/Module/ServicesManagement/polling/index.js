const dispatcher = require("../hook/dispatcher");

module.exports = async function runPolling() {
    const Areas = global.Workflows;
    const Actions = global.Actions;
    const Reactions = global.Reactions;
    const Users = global.User;

    const workflows = await Areas.findAll();

    for (const wf of workflows) {
        const action = await Actions.findByPk(wf.action_id);
        const reaction = await Reactions.findByPk(wf.reaction_id);
        const user = await Users.findByPk(wf.user_id);

        if (!action || !reaction || !user) continue;

        const userInfo = user.info || {};

        const userConfig = {
            github: userInfo.github ? {
                email: userInfo.github.email,
                accessToken: userInfo.github.accessToken,
                refreshToken: userInfo.github.refreshToken,
                providerId: userInfo.github.providerId
            } : null,

            google: userInfo.google ? {
                email: userInfo.google.email,
                accessToken: userInfo.google.accessToken,
                refreshToken: userInfo.google.refreshToken,
                providerId: userInfo.google.providerId
            } : null,

            outlook: userInfo.microsoft ? {
                email: userInfo.microsoft.email,
                accessToken: userInfo.microsoft.accessToken,
                refreshToken: userInfo.microsoft.refreshToken,
                providerId: userInfo.microsoft.providerId
            } : null,
            linkedin: userInfo.linkedin ? {
                email: userInfo.linkedin.email,
                accessToken: userInfo.linkedin.accessToken,
                refreshToken: userInfo.linkedin.refreshToken,
                providerId: userInfo.linkedin.providerId
            } : null
        };

        console.log("[AREA] Triggered:", wf.name);
        const actionResult = await dispatcher.runAction(
            action,
            userConfig,
            wf.Params,
            wf.last_triggered_value
        );
        
        console.log("[AREA] Action Result for", wf.Params);
        console.log("lasttigered", wf.last_triggered_value);
        if (!actionResult || !actionResult.uniqueValue) continue;

        if (wf.last_triggered_value === actionResult.uniqueValue) {
            continue;
        }

        if (actionResult.triggered) {
            await dispatcher.runReaction(
                reaction,
                actionResult,
                userConfig,
                wf.Params
        );

        await wf.update({
            last_triggered_value: actionResult.uniqueValue
        });
            console.log("lasttigered2", wf.last_triggered_value);
        }
    };
}