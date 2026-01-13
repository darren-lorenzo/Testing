const axios = require("axios");

module.exports = async function(params, userConfig) {
    try {
        const result = await axios.get(
            `https://api.github.com/repos/${params.action.github.repo}/commits`,
            {
                headers: {
                    Authorization: `token ${userConfig.github.accessToken}`
                }
            }
        );
        console.log("GitHub user config:", userConfig.github.accessToken);

        const latest = result.data[0].sha;

        if (latest !== params.action.github.lastSha) {
            params.action.github.lastSha = latest;
            return { triggered: true, uniqueValue: latest };
        }

        return { triggered: false };
    } catch (err) {
        console.error("[Github Push Poll Error]", err);
        return { triggered: false };
    }
};
