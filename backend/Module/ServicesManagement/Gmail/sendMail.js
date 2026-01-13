const { google } = require("googleapis");

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

        const rawMail =
            `From: "AREA Bot" <${userConfig.google.email}>\r\n` +
            `To: ${params.reaction.gmail.to}\r\n` +
            `Subject: ${params.reaction.gmail.subject}\r\n\r\n` +
            `${params.reaction.gmail.body}\n`;

        const encoded = Buffer.from(rawMail)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw: encoded }
        });

        return { success: true };
    } catch (err) {
        console.error("[Gmail SendMail Error]", err);
        return { success: false };
    }
};
