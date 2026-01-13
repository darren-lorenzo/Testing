const axios = require("axios");

module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        if (!userConfig.outlook?.accessToken) {
            return { triggered: false };
        }

        const response = await axios.get(
            "https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$top=1&$orderby=receivedDateTime desc",
            {
                headers: {
                    Authorization: `Bearer ${userConfig.outlook.accessToken}`,
                },
            }
        );

        const mail = response.data.value?.[0];

        console.log("[MAIL]", mail)
        if (!mail) {
            return { triggered: false };
        }

        if (mail.id === lastTriggeredValue) {
            return { triggered: false };
        }

        console.log("[AREA][Outlook] Nouveau mail détecté :", mail.subject);

        return {
            triggered: true,
            uniqueValue: mail.id,
            payload: {
                from: mail.from.emailAddress.address,
                subject: mail.subject,
                preview: mail.bodyPreview,
                receivedAt: mail.receivedDateTime
            }
        };

    } catch (err) {
        console.error("[AREA][Outlook] Error:", err.response?.data || err.message);
        return { triggered: false };
    }
};
