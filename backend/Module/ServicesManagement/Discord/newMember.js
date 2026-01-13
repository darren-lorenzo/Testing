const axios = require("axios");

module.exports = async function(params, userConfig) {
    if (!userConfig.discord) return null;

    const { botToken, guildId } = userConfig.discord;

    try {
        const res = await axios.get(
            `https://discord.com/api/v10/guilds/${guildId}/members?limit=1`,
            {
                headers: {
                    Authorization: `Bot ${botToken}`
                }
            }
        );

        const member = res.data[0];

        return {
            triggered: true,
            uniqueValue: member.user.id,
            username: member.user.username
        };

    } catch (err) {
        console.error("[DISCORD ACTION newMember] Error:", err);
        return null;
    }
};
