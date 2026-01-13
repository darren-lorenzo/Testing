module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        const interval = Number(params?.action?.timer?.minutes ?? params?.action?.timer?.interval ?? 15);
        if (!interval || interval <= 0) return { triggered: false };

        const now = new Date(Date.now());
        const minute = now.getUTCMinutes();

        const currentSlot = Math.floor(minute / interval);
        const uniqueValue = `${now.getUTCFullYear()}-${now.getUTCMonth()+1}-${now.getUTCDate()}-${now.getUTCHours()}-${currentSlot}`;

        if (uniqueValue === lastTriggeredValue) return { triggered: false };

        if (minute % interval === 0) {
            return {
                triggered: true,
                uniqueValue,
                payload: { time: now.toISOString(), interval }
            };
        }

        return { triggered: false };
    } catch (err) {
        console.error('[AREA][Timer][every_x_minutes] Error', err);
        return { triggered: false };
    }
};
