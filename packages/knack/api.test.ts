import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { KnackEndpointOutputSchemas } from './endpoints/types';
import { knack } from './index';

/**
 * Live smoke test. Knack needs an application id and an API key, so this skips
 * unless both are set; a run with only one is reported with the missing name
 * rather than passing silently.
 *
 * It writes to the app, so it cleans up after itself: the record it creates is
 * the one it deletes. Point it at a scratch app, not one with real data.
 */
const APPLICATION_ID = process.env.KNACK_APPLICATION_ID;
const API_KEY = process.env.KNACK_API_KEY;
const OBJECT_KEY = process.env.KNACK_OBJECT_KEY ?? 'object_3';
const missing = [
	APPLICATION_ID ? null : 'KNACK_APPLICATION_ID',
	API_KEY ? null : 'KNACK_API_KEY',
].filter((name): name is string => name !== null);

if (missing.length > 0) {
	// A skip that names what is missing cannot be mistaken for a green run.
	console.warn(`[knack live] skipped, set ${missing.join(' and ')} to run it`);
}

const describeIfKey = missing.length === 0 ? describe : describe.skip;

describeIfKey('Knack live API', () => {
	let testDb: ReturnType<typeof createTestDatabase> | undefined;
	let corsair: ReturnType<typeof createCorsair>;
	// The field the plugin writes in these tests, taken from the object's own
	// definition rather than assumed.
	let writableField: string | undefined;
	let createdId: string | undefined;

	beforeAll(async () => {
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'knack', 'default');
		corsair = createCorsair({
			plugins: [knack()],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		await corsair.knack.keys.issue_new_dek();
		await corsair.knack.keys.set_api_key(APPLICATION_ID ?? '');
		await corsair.knack.keys.set_api_secret(API_KEY ?? '');
	});

	// A created record left behind would pollute the app, so it is removed even
	// when a later assertion failed.
	afterAll(async () => {
		if (createdId) {
			await corsair.knack.api.records
				.delete({ object_key: OBJECT_KEY, record_id: createdId })
				.catch(() => undefined);
		}
		testDb?.cleanup();
	});

	// Every answer is passed through its published output schema, so a field
	// typed wrongly fails here rather than for a caller on a successful call.
	it('reads the app metadata and its objects', async () => {
		const app = KnackEndpointOutputSchemas.applicationsGet.parse(
			await corsair.knack.api.applications.get({}),
		);
		expect(app.application.id).toBe(APPLICATION_ID);

		const objects = KnackEndpointOutputSchemas.objectsList.parse(
			await corsair.knack.api.objects.list({}),
		);
		expect(objects.objects.length).toBeGreaterThan(0);

		const target = objects.objects.find((entry) => entry.key === OBJECT_KEY);
		expect(target).toBeDefined();
	});

	it("reads the target object's definition and finds a writable field", async () => {
		const detail = KnackEndpointOutputSchemas.objectsGet.parse(
			await corsair.knack.api.objects.get({ object_key: OBJECT_KEY }),
		);

		expect(detail.object?.key).toBe(OBJECT_KEY);
		// A short-text field is the one this suite can write to safely; system
		// fields and connections are not.
		writableField = detail.object?.fields?.find(
			(field) => field.type === 'short_text' && field.key !== 'field_24',
		)?.key;
		expect(writableField).toBeDefined();
	});

	it('lists records and reports the paging counts', async () => {
		const page = KnackEndpointOutputSchemas.recordsList.parse(
			await corsair.knack.api.records.list({ object_key: OBJECT_KEY }),
		);

		expect(Array.isArray(page.records)).toBe(true);
		expect(page.total_records).toBeGreaterThanOrEqual(page.records.length);
	});

	// The filter must actually narrow the list. Knack silently ignores the
	// unindexed parameter spelling, so the control matters: a record is created
	// first, which makes "unfiltered returns more than zero" a real assertion
	// rather than one an empty table would satisfy either way.
	it('applies a filter rather than ignoring it', async () => {
		const field = writableField ?? 'field_23';
		const marker = `corsair filter control ${Date.now()}`;

		const control = KnackEndpointOutputSchemas.recordsCreate.parse(
			await corsair.knack.api.records.create({
				object_key: OBJECT_KEY,
				fields: { [field]: marker },
			}),
		);
		createdId = control.id;

		const all = KnackEndpointOutputSchemas.recordsList.parse(
			await corsair.knack.api.records.list({ object_key: OBJECT_KEY }),
		);
		// Without this the test passes on an empty table even when the filter is
		// ignored, because both calls would return zero records.
		expect(all.total_records).toBeGreaterThan(0);

		const matching = KnackEndpointOutputSchemas.recordsList.parse(
			await corsair.knack.api.records.list({
				object_key: OBJECT_KEY,
				filters: [{ field, operator: 'is', value: marker }],
			}),
		);
		expect(matching.total_records).toBe(1);
		expect(matching.records[0]?.id).toBe(control.id);

		const none = KnackEndpointOutputSchemas.recordsList.parse(
			await corsair.knack.api.records.list({
				object_key: OBJECT_KEY,
				filters: [
					{ field, operator: 'is', value: 'a value no record will have 12345' },
				],
			}),
		);
		expect(none.total_records).toBe(0);

		const removed = KnackEndpointOutputSchemas.recordsDelete.parse(
			await corsair.knack.api.records.delete({
				object_key: OBJECT_KEY,
				record_id: control.id,
			}),
		);
		expect(removed.delete).toBe(true);
		createdId = undefined;
	});

	it('creates a record, reads it back, updates it, then deletes it', async () => {
		const field = writableField ?? 'field_23';
		const marker = `corsair live ${Date.now()}`;

		const created = KnackEndpointOutputSchemas.recordsCreate.parse(
			await corsair.knack.api.records.create({
				object_key: OBJECT_KEY,
				fields: { [field]: marker },
			}),
		);
		createdId = created.id;
		expect(created.id).toBeTruthy();

		const read = KnackEndpointOutputSchemas.recordsGet.parse(
			await corsair.knack.api.records.get({
				object_key: OBJECT_KEY,
				record_id: created.id,
			}),
		);
		expect(read.id).toBe(created.id);
		expect(read[field]).toBe(marker);

		const updated = KnackEndpointOutputSchemas.recordsUpdate.parse(
			await corsair.knack.api.records.update({
				object_key: OBJECT_KEY,
				record_id: created.id,
				fields: { [field]: `${marker} updated` },
			}),
		);
		expect(updated[field]).toBe(`${marker} updated`);

		const removed = KnackEndpointOutputSchemas.recordsDelete.parse(
			await corsair.knack.api.records.delete({
				object_key: OBJECT_KEY,
				record_id: created.id,
			}),
		);
		expect(removed.delete).toBe(true);
		// Cleared here so the cleanup hook does not try again.
		createdId = undefined;
	});
});
