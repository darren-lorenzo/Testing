const { google } = require("googleapis");

async function find(gmail, from, subject = "") {
    try {
        let query = `from:${from}`;
        if (subject) query += ` subject:${subject}`;

        const res = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults: 1
        });

        if (!res.data.messages || res.data.messages.length === 0) {
            return null;
        }

        const msgId = res.data.messages[0].id;

        const message = await gmail.users.messages.get({
            userId: "me",
            id: msgId,
            format: "metadata",
            metadataHeaders: ["From", "Subject", "Date"]
        });

        const headers = message.data.payload.headers;
        const fromEmail = (headers.find(h => h.name === "From")?.value.match(/<(.+?)>/) || [])[1]
                        || headers.find(h => h.name === "From")?.value;
        const subjectHeader = headers.find(h => h.name === "Subject")?.value || "";
        const dateHeader = headers.find(h => h.name === "Date")?.value || "";

        return { id: msgId, from: fromEmail, subject: subjectHeader, date: dateHeader };
    } catch (err) {
        console.error("[Gmail find Error]", err);
        return null;
    }
}

module.exports = find;
