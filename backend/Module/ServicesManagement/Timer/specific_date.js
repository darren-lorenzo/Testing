function parseDateString(dateStr) {
    if (!dateStr) return null;
    if (/\d{4}-\d{2}-\d{2}T/.test(dateStr)) return new Date(dateStr);

    const parts = dateStr.split(' ');
    const dateParts = parts[0].split('/');
    if (dateParts.length < 3) return null;

    const day = Number(dateParts[0]);
    const month = Number(dateParts[1]) - 1;
    const year = Number(dateParts[2]);

    if (parts[1]) {
        const timeParts = parts[1].split(':');
        const hour = Number(timeParts[0] ?? 0);
        const minute = Number(timeParts[1] ?? 0);
        return new Date(Date.UTC(year, month, day, hour, minute));
    }

    return new Date(Date.UTC(year, month, day));
}

module.exports = async function (params, userConfig, lastTriggeredValue) {
    try {
        const target = params?.action?.timer?.date;
        const targetDate = parseDateString(target);
        if (!targetDate) return { triggered: false };


        const now = new Date(Date.now());
        const nowTs = now.getTime();

        const targetTsUTC = Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), targetDate.getUTCHours(), targetDate.getUTCMinutes());
        const targetTsLocal = new Date(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), targetDate.getUTCHours(), targetDate.getUTCMinutes()).getTime();

        const withinUTC = Math.abs(nowTs - targetTsUTC) < 60 * 1000;
        const withinLocal = Math.abs(nowTs - targetTsLocal) < 60 * 1000;

        if (!withinUTC && !withinLocal) return { triggered: false };

        if (lastTriggeredValue === target) return { triggered: false };

        return {
            triggered: true,
            uniqueValue: target,
            payload: { date: targetDate.toISOString() }
        };
    } catch (err) {
        console.error('[AREA][Timer][specific_date] Error', err);
        return { triggered: false };
    }
};
