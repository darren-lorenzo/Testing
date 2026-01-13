const axios = require("axios");

module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        console.log("Params reçus :", params.action.twitter);

        const bearerToken = userConfig.twitter.accessToken;
        const username = params.action.twitter.username;

        if (!bearerToken || !username) {
            throw new Error("Bearer token ou username manquant");
        }

        const headers = {
            Authorization: `Bearer ${bearerToken}`
        };

        const userRes = await axios.get(
            `https://api.twitter.com/2/users/by/username/${username}`,
            { headers }
        );

        const userId = userRes.data?.data?.id;
        if (!userId) return { triggered: false };

        const tweetRes = await axios.get(
            `https://api.twitter.com/2/users/${userId}/tweets`,
            {
                headers,
                params: {
                    max_results: 1,
                    "tweet.fields": "created_at"
                }
            }
        );

        const tweets = tweetRes.data?.data;
        if (!tweets || tweets.length === 0) {
            return { triggered: false };
        }

        const tweet = tweets[0];

        const uniqueValue = tweet.id;

        if (uniqueValue === lastTriggeredValue) {
            return { triggered: false };
        }

        return {
            triggered: true,
            uniqueValue,
            tweet: {
                id: tweet.id,
                text: tweet.text,
                created_at: tweet.created_at,
                username
            }
        };

    } catch (err) {
        console.error("[Twitter New Tweet Error]", err.response?.data || err.message);
        return { triggered: false };
    }
};
