const axios = require("axios");

module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        if (!userConfig.outlook?.accessToken) {
            return { triggered: false };
        }

        const minutesBefore = Number(params.action.outlook?.minutesBefore ?? 10);

        const now = new Date();
        const endWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const response = await axios.get(
            "https://graph.microsoft.com/v1.0/me/calendarView",
            {
                headers: {
                    Authorization: `Bearer ${userConfig.outlook.accessToken}`,
                },
                params: {
                    startDateTime: now.toISOString(),
                    endDateTime: endWindow.toISOString(),
                    $orderby: "start/dateTime"
                }
            }
        );

        const events = response.data.value || [];

        for (const event of events) {
            if (!event?.id || !event.start?.dateTime) continue;

            if (event.id === lastTriggeredValue) {
                return { triggered: false };
            }

            const startTime = new Date(event.start.dateTime);
            const diffMinutes = (startTime - now) / 60000;

            if (diffMinutes > 0 && diffMinutes <= minutesBefore) {
                console.log(
                    `[AREA][Outlook] Événement "${event.subject}" commence dans ${Math.round(diffMinutes)} minutes`
                );

                return {
                    triggered: true,
                    uniqueValue: event.id,
                    payload: {
                        subject: event.subject,
                        start: event.start,
                        end: event.end,
                        location: event.location,
                        startsInMinutes: Math.round(diffMinutes)
                    }
                };
            }
        }

        return { triggered: false };

    } catch (err) {
        console.error(
            "[AREA][Outlook] Calendar Error:",
            err.response?.data || err.message
        );
        return { triggered: false };
    }
};
