const axios = require("axios");

module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        const result = await axios.get(
            `https://api.github.com/users/${params.action.github.username}/repos`,
            {
                headers: {
                    Authorization: `token ${userConfig.github.accessToken}`
                },
                params: {
                    sort: "created",
                    direction: "asc",
                    per_page: 100
                }
            }
        );
        const repos = result.data.map(r => r.full_name);
        if (repos.length === 0) {
            return { triggered: false };
        }
        const latestRepo = repos[repos.length - 1];
        if (latestRepo === lastTriggeredValue) {
            return { triggered: false };
        }

        return {
            triggered: true,
            uniqueValue: latestRepo,
            repo: {
                name: latestRepo,
                url: `https://github.com/${latestRepo}`,
                created_at: result.data.find(r => r.full_name === latestRepo).created_at
            }
        };

    } catch (err) {
        console.error("[Github New Repo Poll Error]", err.response?.data || err.message);
        return { triggered: false };
    }
};
