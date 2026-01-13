const everyX = require('../Module/ServicesManagement/Timer/every_x_minutes');
const specificDate = require('../Module/ServicesManagement/Timer/specific_date');
const countdown = require('../Module/ServicesManagement/Timer/countdown_finished');

describe('Timer actions', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('every_x_minutes triggers on interval and prevents double trigger', async () => {
        const params = { action: { timer: { minutes: 1 } } };

        // Set time to a fixed instant; with interval=1 it should always trigger
        jest.spyOn(Date, 'now').mockReturnValue(new Date(2026, 0, 6, 10, 15).getTime());

        const first = await everyX(params, {}, null);
        expect(first.triggered).toBe(true);
        expect(first.uniqueValue).toBeDefined();

        const second = await everyX(params, {}, first.uniqueValue);
        expect(second.triggered).toBe(false);
    });

    test('specific_date triggers when date/time matches and avoids re-trigger', async () => {
        const mockDate = new Date(2026, 0, 6, 10, 20);
        jest.spyOn(Date, 'now').mockReturnValue(mockDate.getTime());

        const dd = String(mockDate.getDate()).padStart(2, '0');
        const mm = String(mockDate.getMonth() + 1).padStart(2, '0');
        const yyyy = mockDate.getFullYear();
        const hh = String(mockDate.getHours()).padStart(2, '0');
        const min = String(mockDate.getMinutes()).padStart(2, '0');
        const dateStr = `${dd}/${mm}/${yyyy} ${hh}:${min}`;

        const params = { action: { timer: { date: dateStr } } };

        const first = await specificDate(params, {}, null);
        expect(first.triggered).toBe(true);
        expect(first.uniqueValue).toBe(dateStr);

        const second = await specificDate(params, {}, dateStr);
        expect(second.triggered).toBe(false);
    });

    test('countdown_finished triggers after end time and avoids duplicate', async () => {
        const endsAt = new Date(2026, 0, 6, 9, 0).toISOString();
        const params = { action: { timer: { endsAt } } };

        // current time after end
        jest.spyOn(Date, 'now').mockReturnValue(new Date(2026, 0, 6, 10, 0).getTime());

        const first = await countdown(params, {}, null);
        expect(first.triggered).toBe(true);
        expect(first.uniqueValue).toBe(String(endsAt));

        const second = await countdown(params, {}, endsAt);
        expect(second.triggered).toBe(false);
    });
});
