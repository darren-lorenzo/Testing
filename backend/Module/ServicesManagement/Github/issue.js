const axios = require("axios");

module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        const result = await axios.get(
            `https://api.github.com/repos/${params.action.github.repo}/issues`,
            {
                headers: {
                    Authorization: `token ${userConfig.github.accessToken}`
                },
                params: {
                    state: "open",
                    per_page: 1,
                    sort: "created",
                    direction: "desc"
                }
            }
        );

        const issues = result.data.filter(issue => !issue.pull_request);

        if (issues.length === 0) {
            return { triggered: false };
        }

        const latestIssue = issues[0];
        const issueId = String(latestIssue.id);

        if (issueId === String(lastTriggeredValue)) {
            return { triggered: false };
        }

        return {
            triggered: true,
            uniqueValue: issueId,
            issue: {
                title: latestIssue.title,
                url: latestIssue.html_url,
                number: latestIssue.number,
                author: latestIssue.user.login
            }
        };

    } catch (err) {
        console.error("[Github Issue Poll Error]", err.response?.data || err.message);
        return { triggered: false };
    }
};
