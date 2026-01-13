const { google } = require("googleapis");
const findMessage = require("./find");


module.exports = async function(params, userConfig, lastTriggeredValue) {
    try {
        console.log("Params reçus :", params.action.gmail);
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        oauth2Client.setCredentials({
            refresh_token: userConfig.google.refreshToken
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

        const mail = await findMessage(gmail, params.action.gmail.from, params.action.gmail.subject);
        if (!mail) return { triggered: false };

        const uniqueValue = params.action.gmail.subject ? `${mail.from}::${mail.subject}` : `${mail.from}::${mail.id}`;
        if (uniqueValue === lastTriggeredValue) return { triggered: false };

        return { triggered: true, uniqueValue, mail: { from: mail.from, subject: mail.subject || null } };

    } catch (err) {
        console.error("[Gmail New Mail Error]", err);
        return { triggered: false };
    }
};
