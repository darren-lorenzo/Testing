const axios = require("axios");

module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        if (!userConfig.outlook?.accessToken) {
            return { triggered: false };
        }

        const keyword = (params.action.outlook?.keyword || "urgent").toLowerCase();

        const response = await axios.get(
            "https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$top=5&$orderby=receivedDateTime desc",
            {
                headers: {
                    Authorization: `Bearer ${userConfig.outlook.accessToken}`,
                },
            }
        );

        const mails = response.data.value || [];

        for (const mail of mails) {
            if (!mail?.id) continue;

            if (mail.id === lastTriggeredValue) {
                return { triggered: false };
            }

            const subject = (mail.subject || "").toLowerCase();
            const body = (mail.bodyPreview || "").toLowerCase();

            if (subject.includes(keyword) || body.includes(keyword)) {
                console.log(
                    "[AREA][Outlook] Nouveau mail avec mot-clé détecté :",
                    mail.subject
                );

                return {
                    triggered: true,
                    uniqueValue: mail.id,
                    payload: {
                        from: mail.from.emailAddress.address,
                        subject: mail.subject,
                        preview: mail.bodyPreview,
                        receivedAt: mail.receivedDateTime,
                        keyword
                    }
                };
            }
        }

        return { triggered: false };

    } catch (err) {
        console.error(
            "[AREA][Outlook] Keyword Mail Error:",
            err.response?.data || err.message
        );
        return { triggered: false };
    }
};
