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
        console.log("----------------------Mail found:", params.reaction.gmail.from);
        if (!mail) return { success: false };

        await gmail.users.messages.modify({ userId: "me", id: mail.id, requestBody: { addLabelIds: ["STARRED"] } });
        return { success: true };
    } catch (err) {
        console.error("[Gmail Star Error]", err);
        return { success: false };
    }
};
