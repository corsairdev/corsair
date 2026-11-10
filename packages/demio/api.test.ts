import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { DemioEndpointOutputSchemas } from './endpoints/types';
import { demio } from './index';

/**
 * Live smoke test. Demio needs both credentials, so this skips unless both are
 * set; a run with one of them is reported as a skip with the missing name rather
 * than passing silently. Read-only: registration would email a real person.
 */
const API_KEY = process.env.DEMIO_API_KEY;
const API_SECRET = process.env.DEMIO_API_SECRET;
const missing = [
	API_KEY ? null : 'DEMIO_API_KEY',
	API_SECRET ? null : 'DEMIO_API_SECRET',
].filter((name): name is string => name !== null);

if (missing.length > 0) {
	// A skip that names what is missing cannot be mistaken for a green run.
	console.warn(`[demio live] skipped, set ${missing.join(' and ')} to run it`);
}

const describeIfKey = missing.length === 0 ? describe : describe.skip;

describeIfKey('Demio live API', () => {
	let testDb: ReturnType<typeof createTestDatabase> | undefined;
	let corsair: ReturnType<typeof createCorsair>;

	beforeAll(async () => {
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'demio', 'default');
		corsair = createCorsair({
			plugins: [demio()],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		await corsair.demio.keys.issue_new_dek();
		await corsair.demio.keys.set_api_key(API_KEY ?? '');
		await corsair.demio.keys.set_api_secret(API_SECRET ?? '');
	});

	afterAll(() => testDb?.cleanup());

	// The raw answer is passed through the published output schema, so a field
	// typed wrongly fails here rather than for a caller on a successful call.
	it('accepts the credential pair', async () => {
		const result = await corsair.demio.api.ping.check({});
		const parsed = DemioEndpointOutputSchemas.pingCheck.parse(result);

		expect(parsed.pong).toBe(true);
	});

	it('lists events, every one of which parses', async () => {
		const result = await corsair.demio.api.events.list({});
		const parsed = DemioEndpointOutputSchemas.eventsList.parse(result);

		expect(Array.isArray(parsed)).toBe(true);
	});

	it('reads one event and one of its dates when an event exists', async () => {
		const events = DemioEndpointOutputSchemas.eventsList.parse(
			await corsair.demio.api.events.list({}),
		);
		const first = events[0];
		if (!first) {
			// An account with no events has nothing further to read.
			expect(events).toHaveLength(0);
			return;
		}

		const event = DemioEndpointOutputSchemas.eventsGet.parse(
			await corsair.demio.api.events.get({ id: first.id }),
		);
		expect(event.id).toBe(first.id);

		const date = event.dates[0];
		if (!date) {
			expect(event.dates).toHaveLength(0);
			return;
		}

		const detail = DemioEndpointOutputSchemas.eventsGetDate.parse(
			await corsair.demio.api.events.getDate({
				id: first.id,
				date_id: date.date_id,
			}),
		);
		expect(detail.date_id).toBe(date.date_id);
	});

	// The report is keyed by date, and a scheduled date has registrants too, so
	// this reads the first event's representative date rather than requiring a
	// finished one. An account with no events at all is the only skip path.
	it('reads the participants of an event date', async () => {
		const events = DemioEndpointOutputSchemas.eventsList.parse(
			await corsair.demio.api.events.list({}),
		);
		const first = events[0];
		if (!first) {
			expect(events).toHaveLength(0);
			return;
		}

		const report = DemioEndpointOutputSchemas.reportsParticipants.parse(
			await corsair.demio.api.reports.participants({ date_id: first.date_id }),
		);

		expect(Array.isArray(report.participants)).toBe(true);
		// Recorded live: every registrant carries these, and the status uses
		// spaces while the filter uses hyphens.
		for (const entry of report.participants) {
			expect(typeof entry.email).toBe('string');
			expect(Array.isArray(entry.custom_fields)).toBe(true);
			expect(entry.status).not.toContain('-');
		}
	});
});
