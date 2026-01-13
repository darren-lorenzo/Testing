const dotenv = require('dotenv');
const axios = require('axios');
const jwt = require('jsonwebtoken');
dotenv.config();

const crypto = require('crypto');
const { start } = require('repl');

function generateCodeVerifier() {
    return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
}

/////////////////////////// GitHub

exports.github_login = async (req, res) => {
    // const redirectUri = 'https://area-serv.nogeprods.tech/api/auth/github/callback'
    const redirectUri = 'http://localhost:8080/api/auth/github/callback'
    const clientId = process.env.GITHUB_CLIENT_ID;
    const userId = req.query.userId;
    const state = userId ? `userId=${userId}` : '';

    console.log("===============", state, "===============");

    const plateforme = req.query.plateforme;

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${state}&prompt=consent`;

    res.redirect(url);
};

exports.github_callback = async (req, res) => {
    try {
        const code = req.query.code;
        const state = req.query.state;
        let userId = null;

        if (state && state.startsWith('userId=')) {
            userId = state.split('=')[1];
        }

        const tokenRes = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = tokenRes.data.access_token;
        const refreshToken = tokenRes.data.refresh_token;

        const profileRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        });

        const providerId = profileRes.data.id;

        let email = null;
        try {
            const emailRes = await axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `token ${accessToken}` }
            });

            email = emailRes.data.find(e => e.primary && e.verified)?.email;
        } catch (err) {
            console.log("Impossible de récupérer l'email GitHub :", err.response?.data);
        }

        const User = global.User;
        let user = null;

        if (userId)
            user = await User.findByPk(userId);

        user.set('info', {
            ...user.info,
            github: {
                provider: "github",
                providerId,
                accessToken,
                refreshToken,
                email,
                isConnected: true
            }
        });

        await user.save();

        res.redirect(`http://localhost:8081/services`);

    } catch (err) {
        console.error('GitHub OAuth Error:', err.response?.data || err);
        res.status(500).send("GitHub Login Failed");
    }
};

//////////////////////////////////// Google

exports.google_login = async (req, res) => {
    // const redirectUri = 'https://area-serv.nogeprods.tech/api/auth/google/callback'
    const redirectUri = 'http://localhost:8080/api/auth/google/callback'
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const userId = req.query.userId;
    const state = userId ? `userId=${userId}` : '';

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/youtube https://mail.google.com/&access_type=offline&prompt=consent&state=${state}`;
    res.redirect(url);
};

exports.google_callback = async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    let userId = null;

    if (state && state.startsWith('userId=')) {
        userId = state.split('=')[1];
    }
    // const redirectUri = 'https://area-serv.nogeprods.tech/api/auth/google/callback'
    const redirectUri = 'http://localhost:8080/api/auth/google/callback'
    try {
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        });

        const accessToken = tokenRes.data.access_token;
        const refreshToken = tokenRes.data.refresh_token;

        const profileRes = await axios.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const email = profileRes.data.email;
        const providerId = profileRes.data.id;

        const User = global.User;
        let user = null;

        if (userId)
            user = await User.findByPk(userId);

        user.set('info', {
            ...user.info,
            google: {
                provider: "google",
                providerId,
                accessToken,
                refreshToken,
                email,
                isConnected: true
            }
        });

        await user.save();
        res.redirect(`http://localhost:8081/services`);

    } catch (err) {
        console.error('Google OAuth Error:', err);
        res.send('Google login failed');
    }
}

////////////////////////////// LINKEDIN

exports.linkedin_login = async (req, res) => {
    const redirectUri = "http://localhost:8080/api/auth/linkedin/callback";
    const clientId = process.env.LINKEDIN_CLIENT_ID;

    const userId = req.query.userId;
    const state = userId ? `userId=${userId}` : '123456';

    const scope = encodeURIComponent(
        'openid profile email w_member_social'
    );

    const url =
        `https://www.linkedin.com/oauth/v2/authorization` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&scope=${scope}` +
        `&state=${state}`;

    res.redirect(url);
};


exports.linkedin_callback = async (req, res) => {
    try {
        const code = req.query.code;
        const state = req.query.state;
        let userId = null;

        if (state && state.startsWith('userId=')) {
            userId = state.split('=')[1];
        }
        // const redirectUri = "https://area-serv.nogeprods.tech/api/auth/linkedin/callback";
        const redirectUri = "http://localhost:8080/api/auth/linkedin/callback"

        const tokenRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        console.log(tokenRes.data);

        const accessToken = tokenRes.data.access_token;
        const refreshToken = tokenRes.data.refresh_token;

        const profileRes = await axios.get(
            "https://api.linkedin.com/v2/userinfo",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        console.log(profileRes.data);

        const email = profileRes.data.email
        const providerId = profileRes.data.sub;

        const User = global.User;
        let user = null;

        if (userId)
            user = await User.findByPk(userId);

        user.set('info', {
            ...user.info,
            linkedin: {
                provider: "linkedin",
                providerId,
                accessToken,
                refreshToken,
                email,
                isConnected: true
            }
        });

        await user.save();
        res.redirect(`http://localhost:8081/services`);

    } catch (err) {
        console.error("LinkedIn OAuth Error:", err.response?.data || err);
        res.status(500).send("LinkedIn Login Failed");
    }
};

////////////////////////////// DISCORD

exports.discord_login = async (req, res) => {
    // const redirectUri = 'https://area-serv.nogeprods.tech/api/auth/discord/callback';
    const redirectUri = 'http://localhost:8080/api/auth/discord/callback';
    const userId = req.query.userId;
    const state = userId ? `userId=${userId}` : '';

    const url = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email&state=${state}`;
    // const url = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&integration_type=0&scope=identify+guilds+email+connections+bot+rpc+voice+dm_channels.messages.read+openid&state=${state}`;
    res.redirect(url);
};

exports.discord_callback = async (req, res) => {
    try {
        const code = req.query.code;
        const state = req.query.state;
        let userId = null;

        if (state && state.startsWith('userId=')) {
            userId = state.split('=')[1];
        }
        // const redirectUri = 'https://area-serv.nogeprods.tech/api/auth/discord/callback';
        const redirectUri = 'http://localhost:8080/api/auth/discord/callback';

        const tokenRes = await axios.post(
            "https://discord.com/api/oauth2/token",
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        console.log(tokenRes.data);

        const accessToken = tokenRes.data.access_token;
        const refreshToken = tokenRes.data.refresh_token;

        const profileRes = await axios.get(
            "https://discord.com/api/users/@me",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        console.log(profileRes.data);

        const email = profileRes.data.email;
        const providerId = profileRes.data.id;

        const User = global.User;
        let user = null;

        if (userId)
            user = await User.findByPk(userId);

        user.set('info', {
            ...user.info,
            discord: {
                provider: "discord",
                providerId,
                accessToken,
                refreshToken,
                email,
                isConnected: true
            }
        });

        await user.save();
        res.redirect(`http://localhost:8081/services`);

    } catch (err) {
        console.error("Discord OAuth Error:", err.response?.data || err);
        res.status(500).send("Discord Login Failed");
    }
};

//////////////////////////////////////// microsoft

exports.microsoft_login = (req, res) => {
    const redirectUri = "http://localhost:8080/api/auth/microsoft/callback";
    const clientId = process.env.MICROSOFT_CLIENT_ID;

    const userId = req.query.userId;
    const state = userId ? `userId=${userId}` : '';

    const scope = encodeURIComponent(
        [
            'openid',
            'profile',
            'offline_access',
            'User.Read',
            'Mail.Read',
            'Mail.Send',
            'Calendars.ReadWrite',
            'Team.ReadBasic.All',
            'Channel.ReadBasic.All',
            'ChannelMessage.Send'
        ].join(' ')
    );

    const authUrl =
        `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` +
        `?client_id=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${redirectUri}` +
        `&response_mode=query` +
        `&scope=${scope}` +
        `&state=${state}`;

    res.redirect(authUrl);
};


exports.microsoft_callback = async (req, res) => {
    try {
        const code = req.query.code;
        const state = req.query.state;
        let userId = null;

        if (state && state.startsWith('userId=')) {
            userId = state.split('=')[1];
        }
        const redirectUri = "http://localhost:8080/api/auth/microsoft/callback";

        const tokenRes = await axios.post(
            "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            new URLSearchParams({
                client_id: process.env.MICROSOFT_CLIENT_ID,
                client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                code,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
                scope: "openid profile email User.Read offline_access",
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        console.log(tokenRes.data)

        const {
            access_token,
            refresh_token,
            expires_in,
            id_token
        } = tokenRes.data;

        const expiresAt = Date.now() + expires_in * 1000;

        const profileRes = await axios.get(
            "https://graph.microsoft.com/v1.0/me",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        console.log(profileRes.data)

        const email = profileRes.data.mail || profileRes.data.userPrincipalName;
        const providerId = profileRes.data.id;

        if (userId)
            user = await User.findByPk(userId);

        user.set("info", {
            ...user.info,
            microsoft: {
                provider: "microsoft",
                providerId,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt,
                email,
                isConnected: true,
            },
        });
        await user.save();

        res.redirect("http://localhost:8081/services");

    } catch (err) {
        console.error(
            "Microsoft OAuth Error:",
            err.response?.data || err.message
        );
        res.status(500).send("Microsoft Login Failed");
    }
};

////////////////////////////// TIMER

exports.timer_check = async (req, res) => {
    try {
        const User = global.User;
        const userId = req.user.id; // Depuis votre middleware d'auth

        let user = await User.findByPk(userId);

        // Activer le service Timer pour l'utilisateur
        user.set('info', {
            ...user.info,
            timer: {
                provider: 'timer',
                isConnected: true,
                activatedAt: new Date().toISOString()
            }
        });

        await user.save();
        res.json({ success: true, message: 'Timer service activated' });

    } catch (err) {
        console.error('Timer activation error:', err);
        res.status(500).json({ error: 'Timer activation failed' });
    }
};

// Fonctions utilitaires pour les Actions Timer
exports.checkTimeMatch = (targetTime) => {
    const now = new Date();
    const [hours, minutes] = targetTime.split(':');
    return now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes);
};

exports.checkDateMatch = (targetDate) => {
    const now = new Date();
    const [day, month] = targetDate.split('/');
    return now.getDate() === parseInt(day) && now.getMonth() + 1 === parseInt(month);
};

exports.checkDaysUntil = (daysCount, dayName) => {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + parseInt(daysCount));
    
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const futureDayName = daysOfWeek[futureDate.getDay()];
    
    return futureDayName.toLowerCase() === dayName.toLowerCase();
};

exports.isWeekday = () => {
    const now = new Date();
    const day = now.getDay();
    return day >= 1 && day <= 5;
};

////////////////////////////// META (Facebook)

exports.meta_login = async (req, res) => {
    const redirectUri = 'http://localhost:8080/api/auth/meta/callback';
    const userId = req.query.userId;
    const state = userId ? `userId=${userId}` : '';

    // Permissions Facebook + Instagram
    const scope = [
        'email',
        'public_profile',
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_posts',
        'instagram_basic',
        'instagram_content_publish'
    ].join(',');

    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&response_type=code`;

    res.redirect(url);
};

exports.meta_callback = async (req, res) => {
    try {
        const code = req.query.code;
        const state = req.query.state;
        let userId = null;

        if (state && state.startsWith('userId=')) {
            userId = state.split('=')[1];
        }

        const redirectUri = 'http://localhost:8080/api/auth/meta/callback';

        // Échanger le code contre un access token
        const tokenRes = await axios.get(
            `https://graph.facebook.com/v18.0/oauth/access_token`,
            {
                params: {
                    client_id: process.env.META_APP_ID,
                    client_secret: process.env.META_APP_SECRET,
                    code,
                    redirect_uri: redirectUri
                }
            }
        );

        console.log(tokenRes.data);

        const accessToken = tokenRes.data.access_token;
        const expiresIn = tokenRes.data.expires_in;

        // Obtenir un token de longue durée (60 jours)
        const longTokenRes = await axios.get(
            `https://graph.facebook.com/v18.0/oauth/access_token`,
            {
                params: {
                    grant_type: 'fb_exchange_token',
                    client_id: process.env.META_APP_ID,
                    client_secret: process.env.META_APP_SECRET,
                    fb_exchange_token: accessToken
                }
            }
        );

        const longLivedToken = longTokenRes.data.access_token;

        // Récupérer le profil utilisateur
        const profileRes = await axios.get(
            'https://graph.facebook.com/v18.0/me',
            {
                params: {
                    fields: 'id,name,email,picture',
                    access_token: longLivedToken
                }
            }
        );

        console.log(profileRes.data);

        const email = profileRes.data.email;
        const name = profileRes.data.name;
        const providerId = profileRes.data.id;
        const picture = profileRes.data.picture?.data?.url;

        // Récupérer les pages Facebook (optionnel)
        let pages = [];
        try {
            const pagesRes = await axios.get(
                'https://graph.facebook.com/v18.0/me/accounts',
                {
                    params: { access_token: longLivedToken }
                }
            );
            pages = pagesRes.data.data;
        } catch (err) {
            console.log('No pages found or permission denied');
        }

        // Récupérer le compte Instagram (optionnel)
        let instagramAccountId = null;
        try {
            if (pages.length > 0) {
                const igRes = await axios.get(
                    `https://graph.facebook.com/v18.0/${pages[0].id}`,
                    {
                        params: {
                            fields: 'instagram_business_account',
                            access_token: pages[0].access_token
                        }
                    }
                );
                instagramAccountId = igRes.data.instagram_business_account?.id;
            }
        } catch (err) {
            console.log('No Instagram account linked');
        }

        const User = global.User;
        let user = null;

        if (userId)
            user = await User.findByPk(userId);

        user.set('info', {
            ...user.info,
            meta: {
                provider: 'meta',
                providerId,
                accessToken: longLivedToken,
                expiresIn,
                email,
                name,
                picture,
                pages,
                instagramAccountId,
                isConnected: true
            }
        });

        await user.save();
        res.redirect('http://localhost:8081/services');

    } catch (err) {
        console.error('Meta OAuth Error:', err.response?.data || err);
        res.status(500).send('Meta Login Failed');
    }
};

////////////////////////////////////////////// X (TWITTER)

const verifierStore = new Map();

exports.twitter_login = (req, res) => {
    const redirectUri = 'http://localhost:8080/api/auth/twitter/callback';
    const userId = req.query.userId;
    const state = userId ? `userId=${userId}` : crypto.randomBytes(16).toString('hex');

    const scope = encodeURIComponent('tweet.read tweet.write users.read follows.read follows.write offline.access');

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Stocker le verifier avec le state comme clé
    verifierStore.set(state, codeVerifier);

    const url =
        `https://twitter.com/i/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=${process.env.TWITTER_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${scope}` +
        `&state=${state}` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256`;

    res.redirect(url);
};

exports.twitter_callback = async (req, res) => {
    try {
        const code = req.query.code;
        const state = req.query.state;
        let userId = null;

        if (state && state.startsWith('userId=')) {
            userId = state.split('=')[1];
        }

        const codeVerifier = verifierStore.get(state);
        if (!codeVerifier) {
            throw new Error('Code verifier not found - session may have expired');
        }

        verifierStore.delete(state);

        const redirectUri = 'http://localhost:8080/api/auth/twitter/callback';

        const credentials = Buffer.from(
            `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString('base64');

        const tokenRes = await axios.post(
            'https://api.twitter.com/2/oauth2/token',
            new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                code_verifier: codeVerifier
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                }
            }
        );

        console.log(tokenRes.data);

        const {
            access_token,
            refresh_token,
            expires_in
        } = tokenRes.data;

        const expiresAt = Date.now() + expires_in * 1000;

        const profileRes = await axios.get(
            'https://api.twitter.com/2/users/me',
            {
                headers: { Authorization: `Bearer ${access_token}` }
            }
        );

        const { id: providerId, username, name } = profileRes.data.data;

        const User = global.User;
        let user = null;
        if (userId) user = await User.findByPk(userId);

        user.set('info', {
            ...user.info,
            twitter: {
                provider: 'twitter',
                providerId,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt,
                username,
                name,
                isConnected: true
            }
        });

        await user.save();
        res.redirect('http://localhost:8081/services');

    } catch (err) {
        console.error('Twitter OAuth Error:', err.response?.data || err);
        res.status(500).send('Twitter Login Failed');
    }
};

////////////////////////////// TWITCH

exports.twitch_login = (req, res) => {
    const redirectUri = 'http://localhost:8080/api/auth/twitch/callback';
    const userId = req.query.userId;
    const state = userId ? `userId=${userId}` : '';

    const scope = encodeURIComponent('user:read:email channel:read:subscriptions chat:read chat:edit');

    const url =
        `https://id.twitch.tv/oauth2/authorize` +
        `?client_id=${process.env.TWITCH_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${scope}` +
        `&state=${state}`;

    res.redirect(url);
};

exports.twitch_callback = async (req, res) => {
    try {
        const code = req.query.code;
        const state = req.query.state;
        let userId = null;

        if (state?.startsWith('userId=')) {
            userId = state.split('=')[1];
        }

        const redirectUri = 'http://localhost:8080/api/auth/twitch/callback';

        const tokenRes = await axios.post(
            'https://id.twitch.tv/oauth2/token',
            new URLSearchParams({
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const {
            access_token,
            refresh_token,
            expires_in
        } = tokenRes.data;

        const expiresAt = Date.now() + expires_in * 1000;

        const profileRes = await axios.get(
            'https://api.twitch.tv/helix/users',
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Client-Id': process.env.TWITCH_CLIENT_ID
                }
            }
        );

        const userData = profileRes.data.data[0];
        const { id: providerId, login, display_name, email, profile_image_url } = userData;

        const User = global.User;
        let user = null;
        if (userId) user = await User.findByPk(userId);

        user.set('info', {
            ...user.info,
            twitch: {
                provider: 'twitch',
                providerId,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt,
                login,
                displayName: display_name,
                email,
                profileImage: profile_image_url,
                isConnected: true
            }
        });

        await user.save();
        res.redirect('http://localhost:8081/services');

    } catch (err) {
        console.error('Twitch OAuth Error:', err.response?.data || err);
        res.status(500).send('Twitch Login Failed');
    }
};