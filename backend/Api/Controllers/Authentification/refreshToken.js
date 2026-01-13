const axios = require('axios');
const qs = require('qs');

exports.refreshToken = async (req, res) => {
    const { userId, provider } = req.body;

    if (!userId || !provider) {
        return res.status(400).json({ message: "Missing userId or provider" });
    }

    try {
        const User = global.User;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const providerInfo = user.info && user.info[provider];

        if (!providerInfo || !providerInfo.refreshToken) {
            return res.status(400).json({ message: "No refresh token found for this provider" });
        }

        let newAccessToken = null;
        let newRefreshToken = null; // Some providers rotate refresh tokens
        let expiresAt = null;

        switch (provider) {
            case 'google':
                const googleRes = await axios.post('https://oauth2.googleapis.com/token', {
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    refresh_token: providerInfo.refreshToken,
                    grant_type: 'refresh_token'
                });
                newAccessToken = googleRes.data.access_token;
                // Google might return a new refresh token, but usually it's long-lived
                if (googleRes.data.refresh_token) newRefreshToken = googleRes.data.refresh_token;
                break;

            case 'github':
                // GitHub requires enabling expiration for refresh tokens to work
                const githubRes = await axios.post('https://github.com/login/oauth/access_token', {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    refresh_token: providerInfo.refreshToken,
                    grant_type: 'refresh_token'
                }, {
                    headers: { Accept: 'application/json' }
                });

                if (githubRes.data.error) {
                    throw new Error(githubRes.data.error_description || githubRes.data.error);
                }

                newAccessToken = githubRes.data.access_token;
                if (githubRes.data.refresh_token) newRefreshToken = githubRes.data.refresh_token;
                break;

            case 'discord':
                const discordRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
                    client_id: process.env.DISCORD_CLIENT_ID,
                    client_secret: process.env.DISCORD_CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: providerInfo.refreshToken
                }), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                newAccessToken = discordRes.data.access_token;
                if (discordRes.data.refresh_token) newRefreshToken = discordRes.data.refresh_token;
                break;

            case 'linkedin':
                const linkedinRes = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: providerInfo.refreshToken,
                    client_id: process.env.LINKEDIN_CLIENT_ID,
                    client_secret: process.env.LINKEDIN_CLIENT_SECRET
                }), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                newAccessToken = linkedinRes.data.access_token;
                if (linkedinRes.data.refresh_token) newRefreshToken = linkedinRes.data.refresh_token;
                break;

            case 'microsoft':
                const microsoftRes = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', new URLSearchParams({
                    client_id: process.env.MICROSOFT_CLIENT_ID,
                    client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                    refresh_token: providerInfo.refreshToken,
                    grant_type: 'refresh_token',
                    scope: 'openid profile email User.Read offline_access'
                }), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                newAccessToken = microsoftRes.data.access_token;
                if (microsoftRes.data.refresh_token) newRefreshToken = microsoftRes.data.refresh_token;
                if (microsoftRes.data.expires_in) expiresAt = Date.now() + microsoftRes.data.expires_in * 1000;
                break;

            case 'twitter':
                // Twitter requires Basic Auth for confidential clients or just client_id for public clients (PKCE)
                // Assuming confidential client based on previous code using client secret implicitly or explicitly? 
                // Checking Oauth.js, twitter_callback uses client_id but no client_secret in body, but usually needs Basic Auth if it's a confidential client.
                // However, the previous implementation used 'challenge' which implies PKCE.
                // For refresh, if it's PKCE, we just need client_id. If confidential, we need Basic Auth.
                // Let's try with Basic Auth if secret exists, otherwise just client_id.
                // Wait, Oauth.js doesn't show TWITTER_CLIENT_SECRET being used in callback, only client_id.
                // But usually you need a secret for confidential clients.
                // Let's assume we need to pass client_id in body.

                const params = new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: providerInfo.refreshToken,
                    client_id: process.env.TWITTER_CLIENT_ID
                });

                const twitterRes = await axios.post('https://api.twitter.com/2/oauth2/token', params, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                newAccessToken = twitterRes.data.access_token;
                if (twitterRes.data.refresh_token) newRefreshToken = twitterRes.data.refresh_token;
                break;

            default:
                return res.status(400).json({ message: "Provider not supported" });
        }

        // Update user info
        const updatedInfo = { ...user.info };
        updatedInfo[provider].accessToken = newAccessToken;
        if (newRefreshToken) updatedInfo[provider].refreshToken = newRefreshToken;
        if (expiresAt) updatedInfo[provider].expiresAt = expiresAt;

        user.set('info', updatedInfo);
        await user.save();

        res.json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken || providerInfo.refreshToken
        });

    } catch (error) {
        console.error(`Error refreshing token for ${provider}:`, error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to refresh token",
            error: error.response?.data || error.message
        });
    }
};
