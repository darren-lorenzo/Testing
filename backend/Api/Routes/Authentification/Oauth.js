const express = require('express');
const router = express.Router();
const Oauth = require('../../Controllers/Authentification/Oauth.js');

router.get('/github', Oauth.github_login);
router.get('/github/callback', Oauth.github_callback);

router.get('/google', Oauth.google_login);
router.get('/google/callback', Oauth.google_callback);

router.get('/linkedin', Oauth.linkedin_login);
router.get('/linkedin/callback', Oauth.linkedin_callback);

router.get('/discord', Oauth.discord_login);
router.get('/discord/callback', Oauth.discord_callback);

router.get('/microsoft', Oauth.microsoft_login);
router.get('/microsoft/callback', Oauth.microsoft_callback);

router.get('/meta', Oauth.meta_login);
router.get('/meta/callback', Oauth.meta_callback);

router.get('/twitter', Oauth.twitter_login);
router.get('/twitter/callback', Oauth.twitter_callback);

router.get('/twitch', Oauth.twitch_login);
router.get('/twitch/callback', Oauth.twitch_callback);

module.exports = router;
