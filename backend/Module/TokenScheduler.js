const cron = require('node-cron');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

let schedulerTask = null;

const refreshTokenForProvider = async (user, provider) => {
    try {
        const providerInfo = user.info && user.info[provider];

        if (!providerInfo || !providerInfo.refreshToken) {
            return null;
        }

        let newAccessToken = null;
        let newRefreshToken = null;
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
                if (googleRes.data.refresh_token) newRefreshToken = googleRes.data.refresh_token;
                if (googleRes.data.expires_in) expiresAt = Date.now() + googleRes.data.expires_in * 1000;
                break;

            case 'github':
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
                if (githubRes.data.expires_in) expiresAt = Date.now() + githubRes.data.expires_in * 1000;
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
                if (discordRes.data.expires_in) expiresAt = Date.now() + discordRes.data.expires_in * 1000;
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
                if (linkedinRes.data.expires_in) expiresAt = Date.now() + linkedinRes.data.expires_in * 1000;
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

            default:
                return null;
        }

        // Update user with new tokens
        user.set('info', {
            ...user.info,
            [provider]: {
                ...providerInfo,
                accessToken: newAccessToken,
                ...(newRefreshToken && { refreshToken: newRefreshToken }),
                ...(expiresAt && { expiresAt })
            }
        });

        await user.save();
        console.log(`✓ Token refreshed for ${provider} (User ID: ${user.id})`);
        return true;

    } catch (error) {
        console.error(`✗ Error refreshing ${provider} token for user ${user.id}:`, error.message);
        return false;
    }
};

/**
 * Initialise le scheduler pour rafraîchir les tokens toutes les heures
 * @param {Object} User - Le modèle Sequelize de User
 */
exports.initTokenScheduler = (User) => {
    // Schedule runs at every hour (0 * * * *)
    // This means at minute 0 of every hour
    schedulerTask = cron.schedule('0 * * * *', async () => {
        console.log(`\n[${new Date().toISOString()}] Starting OAuth token refresh task...`);

        try {
            const users = await User.findAll();
            let refreshedCount = 0;

            for (const user of users) {
                if (!user.info) continue;

                // Refresh tokens for each connected provider
                const providers = ['google', 'github', 'discord', 'linkedin', 'microsoft'];

                for (const provider of providers) {
                    if (user.info[provider] && user.info[provider].isConnected) {
                        const success = await refreshTokenForProvider(user, provider);
                        if (success) refreshedCount++;
                    }
                }
            }

            console.log(`✓ Token refresh task completed: ${refreshedCount} token(s) refreshed\n`);

        } catch (error) {
            console.error('Error in token refresh scheduler:', error);
        }
    });

    console.log('✓ OAuth Token Scheduler initialized - runs every hour');
};

/**
 * Arrête le scheduler
 */
exports.stopTokenScheduler = () => {
    if (schedulerTask) {
        schedulerTask.stop();
        console.log('✓ OAuth Token Scheduler stopped');
    }
};

/**
 * Déclenche manuellement un rafraîchissement immédiat (utile pour les tests)
 * @param {Object} User - Le modèle Sequelize de User
 */
exports.manualTokenRefresh = async (User) => {
    console.log(`\n[${new Date().toISOString()}] Manual OAuth token refresh triggered...`);

    try {
        const users = await User.findAll();
        let refreshedCount = 0;

        for (const user of users) {
            if (!user.info) continue;

            const providers = ['google', 'github', 'discord', 'linkedin', 'microsoft'];

            for (const provider of providers) {
                if (user.info[provider] && user.info[provider].isConnected) {
                    const success = await refreshTokenForProvider(user, provider);
                    if (success) refreshedCount++;
                }
            }
        }

        console.log(`✓ Manual refresh completed: ${refreshedCount} token(s) refreshed\n`);
        return refreshedCount;

    } catch (error) {
        console.error('Error in manual token refresh:', error);
        throw error;
    }
};
