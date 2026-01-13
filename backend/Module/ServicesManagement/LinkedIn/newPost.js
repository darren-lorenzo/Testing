const axios = require('axios');

module.exports = async function (params, actionPayload, userConfig) {
    try {
        const accessToken = userConfig.linkedin.accessToken;
        const providerId = userConfig.linkedin.providerId;

        if (!accessToken || !providerId) {
            throw new Error("Access Token ou providerId manquant pour LinkedIn");
        }

        const postText = params.reaction.LinkedIn.text || "Nouveau post";
        const imageUrl = params.reaction.LinkedIn.imageUrl;

        const payload = {
            author: `urn:li:person:${providerId}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: { text: postText },
                    shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
                    ...(imageUrl && {
                        media: [
                            {
                                status: 'READY',
                                description: { text: postText },
                                originalUrl: imageUrl,
                                title: { text: 'IMAGE' }
                            }
                        ]
                    })
                }
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS' }
        };

        const response = await axios.post(
            'https://api.linkedin.com/v2/ugcPosts',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('[LinkedIn] Post créé avec succès !', response.data);
        return { success: true, data: response.data, postId: response.data.id };

    } catch (error) {
        console.error('[LinkedIn Publish Error]', error.message || error);
        return { success: false, error: error.message };
    }
};
