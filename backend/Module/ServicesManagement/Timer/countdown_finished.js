module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        const endsAt = params?.action?.timer?.endsAt ?? params?.action?.timer?.target;
        if (!endsAt) return { triggered: false };

        const endTs = isNaN(Number(endsAt)) ? new Date(endsAt).getTime() : Number(endsAt);
        if (!endTs || isNaN(endTs)) return { triggered: false };

        const nowTs = Date.now();

        if (nowTs < endTs) return { triggered: false };

        if (String(lastTriggeredValue) === String(endsAt)) return { triggered: false };

        return {
            triggered: true,
            uniqueValue: String(endsAt),
            payload: { endedAt: new Date(endTs).toISOString() }
        };
    } catch (err) {
        console.error('[AREA][Timer][countdown_finished] Error', err);
        return { triggered: false };
    }
};
