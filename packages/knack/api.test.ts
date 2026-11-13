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
	// The field the plugin writes in these tests, read from the object's own
	// definition in beforeAll so no test depends on another having run.
	let writableField: string;
	// Every record a test creates, until its delete is confirmed. A failed
	// assertion leaves the id here and afterAll removes it.
	const created = new Set<string>();

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

		const detail = KnackEndpointOutputSchemas.objectsGet.parse(
			await corsair.knack.api.objects.get({ object_key: OBJECT_KEY }),
		);
		// A short-text field is the one this suite can write to safely; system
		// fields and connections are not.
		const field = detail.object?.fields?.find(
			(entry) => entry.type === 'short_text',
		)?.key;
		if (!field) {
			throw new Error(`${OBJECT_KEY} has no short-text field to write to`);
		}
		writableField = field;
	});

	// A created record left behind would pollute the app, so it is removed even
	// when a later assertion failed. Every deletion is attempted, and any that
	// fails is reported so a record left in the app does not go unnoticed.
	afterAll(async () => {
		const failed: string[] = [];
		for (const id of created) {
			await corsair.knack.api.records
				.delete({ object_key: OBJECT_KEY, record_id: id })
				.catch((error: unknown) => {
					failed.push(
						`${id}: ${error instanceof Error ? error.message : String(error)}`,
					);
				});
		}
		testDb?.cleanup();
		if (failed.length > 0) {
			throw new Error(
				`Could not delete ${failed.length} Knack record(s) in ${OBJECT_KEY}: ${failed.join('; ')}`,
			);
		}
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

	it("reads the target object's definition", async () => {
		const detail = KnackEndpointOutputSchemas.objectsGet.parse(
			await corsair.knack.api.objects.get({ object_key: OBJECT_KEY }),
		);

		expect(detail.object?.key).toBe(OBJECT_KEY);
		expect(detail.object?.fields?.some((f) => f.key === writableField)).toBe(
			true,
		);
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
		const field = writableField;
		const marker = `corsair-plugin-test filter ${Date.now()}`;

		const control = KnackEndpointOutputSchemas.recordsCreate.parse(
			await corsair.knack.api.records.create({
				object_key: OBJECT_KEY,
				fields: { [field]: marker },
			}),
		);
		created.add(control.id);

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
		created.delete(control.id);
	});

	it('creates a record, reads it back, updates it, then deletes it', async () => {
		const field = writableField;
		const marker = `corsair-plugin-test ${Date.now()}`;

		const record = KnackEndpointOutputSchemas.recordsCreate.parse(
			await corsair.knack.api.records.create({
				object_key: OBJECT_KEY,
				fields: { [field]: marker },
			}),
		);
		created.add(record.id);
		expect(record.id).toBeTruthy();

		const read = KnackEndpointOutputSchemas.recordsGet.parse(
			await corsair.knack.api.records.get({
				object_key: OBJECT_KEY,
				record_id: record.id,
			}),
		);
		expect(read.id).toBe(record.id);
		expect(read[field]).toBe(marker);

		const updated = KnackEndpointOutputSchemas.recordsUpdate.parse(
			await corsair.knack.api.records.update({
				object_key: OBJECT_KEY,
				record_id: record.id,
				fields: { [field]: `${marker} updated` },
			}),
		);
		expect(updated[field]).toBe(`${marker} updated`);

		const removed = KnackEndpointOutputSchemas.recordsDelete.parse(
			await corsair.knack.api.records.delete({
				object_key: OBJECT_KEY,
				record_id: record.id,
			}),
		);
		expect(removed.delete).toBe(true);
		// Removed here so the cleanup hook does not try again.
		created.delete(record.id);
	});
});
