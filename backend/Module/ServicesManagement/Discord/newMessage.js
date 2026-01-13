const axios = require("axios");

module.exports = async function(params, userConfig) {
    if (!userConfig.discord) return null;

    const { botToken, channelId } = userConfig.discord;

    try {
        const res = await axios.get(
            `https://discord.com/api/v10/channels/${channelId}/messages?limit=1`,
            {
                headers: {
                    Authorization: `Bot ${botToken}`
                }
            }
        );

        const msg = res.data[0];

        return {
            triggered: true,
            uniqueValue: msg.id,
            message: msg.content,
            author: msg.author.username
        };

    } catch (err) {
        console.error("[DISCORD ACTION newMessage] Error:", err);
        return null;
    }
};
