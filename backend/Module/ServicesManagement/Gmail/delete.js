const { google } = require("googleapis");
const findMessage = require("./find");

module.exports = async function(params, actionPayload, userConfig) {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: userConfig.google.refreshToken
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const mail = await findMessage(gmail, params.reaction.gmail.from, params.reaction.gmail.subject);
        if (!mail) return { success: false };

        await gmail.users.messages.delete({ userId: "me", id: mail.id });
        return { success: true };
    } catch (err) {
        console.error("[Gmail Delete Error]", err);
        return { success: false };
    }
};
