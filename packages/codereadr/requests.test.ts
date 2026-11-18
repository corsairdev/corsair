import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { codereadr } from './index';
import {
	CREATED_XML,
	DATABASE_VALUES_XML,
	SCANS_XML,
	SUCCESS_XML,
	UPLOADS_XML,
} from './test-fixtures';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'codereadr', 'default');
	const corsair = createCorsair({
		plugins: [codereadr({ key: 'codereadr-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

function respondXml(body: string, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, {
			status,
			headers: { 'Content-Type': 'text/xml; charset=utf-8' },
		}),
	);
}

/** The form variables of the request the plugin actually sent. */
function sentForm(callIndex = 0): URLSearchParams {
	const [, init] = fetchMock.mock.calls[callIndex] as [string, RequestInit];
	return new URLSearchParams(String(init.body));
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and
	// send a live request, so every call a test did not stub fails instead.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response with respondXml first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

/**
 * One test per operation, asserting the `section` and `action` that select it
 * on the wire plus every variable the call sends. The API routes on those two
 * strings, so a wrong action or a misnamed variable is a silent wrong result
 * rather than an error the types would catch.
 */
describe('request shape per operation', () => {
	it('scans.list sends its search variables', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SCANS_XML);

			await corsair.codereadr.api.scans.list({
				keyword: 'dock',
				service_id: [1005, 1010],
				device_id: 'all',
				user_id: [3],
				scan_id: [13193],
				status: ['1', '0'],
				start_date: '2026-11-01',
				start_time: '08:00:00',
				end_date: '2026-11-08',
				end_time: '17:00:00',
				upload_id: [7],
				limit: 25,
				offset: 10,
				show_properties: true,
				include_property: ['mode', 'color'],
				exclude_property: ['draft'],
				with_property: { mode: 'auto' },
				without_property: { color: 'red' },
				value: 'A1',
				valuelike: 'B2',
				response: 'ok',
				responselike: 'fine',
				timestamp_received: true,
				timestamp_modified: false,
				modified_diff: '< 2 minute',
				timezone: 'America/New_York',
				order_by: 'timestamp_desc',
				only_recent: true,
			});

			const form = sentForm();
			expect(form.get('section')).toBe('scans');
			expect(form.get('action')).toBe('retrieve');
			expect(form.get('keyword')).toBe('dock');
			expect(form.get('service_id')).toBe('1005,1010');
			expect(form.get('device_id')).toBe('all');
			expect(form.get('user_id')).toBe('3');
			expect(form.get('scan_id')).toBe('13193');
			expect(form.get('status')).toBe('1,0');
			expect(form.get('start_date')).toBe('2026-11-01');
			expect(form.get('start_time')).toBe('08:00:00');
			expect(form.get('end_date')).toBe('2026-11-08');
			expect(form.get('end_time')).toBe('17:00:00');
			expect(form.get('upload_id')).toBe('7');
			expect(form.get('limit')).toBe('25');
			expect(form.get('offset')).toBe('10');
			expect(form.get('showProperties')).toBe('1');
			expect(form.get('includeProperty')).toBe('mode,color');
			expect(form.get('excludeProperty')).toBe('draft');
			expect(form.get('with_property[mode]')).toBe('auto');
			expect(form.get('without_property[color]')).toBe('red');
			expect(form.get('value')).toBe('A1');
			expect(form.get('valuelike')).toBe('B2');
			expect(form.get('response')).toBe('ok');
			expect(form.get('responselike')).toBe('fine');
			expect(form.get('timestamp_received')).toBe('1');
			expect(form.get('timestamp_modified')).toBe('0');
			expect(form.get('modified_diff')).toBe('< 2 minute');
			expect(form.get('timezone')).toBe('America/New_York');
			expect(form.get('order_by')).toBe('timestamp_desc');
			expect(form.get('only_recent')).toBe('1');
		} finally {
			testDb.cleanup();
		}
	});

	it('scans.delete sends the joined IDs and reports them back', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			const result = await corsair.codereadr.api.scans.delete({
				scan_id: [13193, 13194],
			});

			const form = sentForm();
			expect(form.get('section')).toBe('scans');
			expect(form.get('action')).toBe('delete');
			expect(form.get('scan_id')).toBe('13193,13194');
			expect(result).toEqual({ success: true, scan_ids: [13193, 13194] });
		} finally {
			testDb.cleanup();
		}
	});

	it('services.create sends every scan-behaviour variable under its wire name', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(CREATED_XML);

			await corsair.codereadr.api.services.create({
				validation_method: 'database',
				database_id: 757,
				service_name: 'Dock intake',
				description: 'North gate',
				duplicate_value: 0,
				device_duplicate_value: 1,
				view_other_scans: true,
				enable_gps: true,
				enable_direct_scan: true,
				auto_sync_down_url: true,
				symbologies: [33, 34],
				auto_next_scan: 2,
				upload_email_format: 'properties',
			});

			const form = sentForm();
			expect(form.get('section')).toBe('services');
			expect(form.get('action')).toBe('create');
			expect(form.get('validation_method')).toBe('database');
			expect(form.get('database_id')).toBe('757');
			expect(form.get('service_name')).toBe('Dock intake');
			expect(form.get('description')).toBe('North gate');
			expect(form.get('duplicate_value')).toBe('0');
			expect(form.get('device_duplicate_value')).toBe('1');
			// CodeREADr spells these two in camel case.
			expect(form.get('viewOtherScans')).toBe('1');
			expect(form.get('enableGPS')).toBe('1');
			expect(form.get('enable_direct_scan')).toBe('1');
			expect(form.get('auto_sync_down_url')).toBe('1');
			expect(form.get('symbologies')).toBe('33,34');
			expect(form.get('auto_next_scan')).toBe('2');
			expect(form.get('upload_email_format')).toBe('properties');
		} finally {
			testDb.cleanup();
		}
	});

	it('services.update sends the ID and only the changed variables', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			const result = await corsair.codereadr.api.services.update({
				service_id: 927,
				service_name: 'Dock intake north',
			});

			const form = sentForm();
			expect(form.get('section')).toBe('services');
			expect(form.get('action')).toBe('update');
			expect(form.get('service_id')).toBe('927');
			expect(form.get('service_name')).toBe('Dock intake north');
			// An omitted variable must not be sent, or it would reset the setting.
			expect(form.has('postback_url')).toBe(false);
			expect(form.has('symbologies')).toBe(false);
			expect(result).toEqual({ success: true, service_id: 927 });
		} finally {
			testDb.cleanup();
		}
	});

	it('services.delete accepts the all keyword', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.services.delete({ service_id: 'all' });

			const form = sentForm();
			expect(form.get('section')).toBe('services');
			expect(form.get('action')).toBe('delete');
			expect(form.get('service_id')).toBe('all');
		} finally {
			testDb.cleanup();
		}
	});

	it('databases.create sends the name and case sensitivity', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(CREATED_XML);

			const result = await corsair.codereadr.api.databases.create({
				database_name: 'Event tickets',
				case_sensitivity: false,
			});

			const form = sentForm();
			expect(form.get('section')).toBe('databases');
			expect(form.get('action')).toBe('create');
			expect(form.get('database_name')).toBe('Event tickets');
			expect(form.get('case_sensitivity')).toBe('0');
			expect(result).toEqual({ success: true, database_id: 1001 });
		} finally {
			testDb.cleanup();
		}
	});

	it('databases.update renames with the database name variable', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			const result = await corsair.codereadr.api.databases.update({
				database_id: 120,
				database_name: 'Event tickets 2026',
			});

			const form = sentForm();
			expect(form.get('section')).toBe('databases');
			expect(form.get('action')).toBe('update');
			expect(form.get('database_id')).toBe('120');
			expect(form.get('database_name')).toBe('Event tickets 2026');
			expect(result).toEqual({ success: true, database_id: 120 });
		} finally {
			testDb.cleanup();
		}
	});

	it('databases.delete sends the database ID', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			const result = await corsair.codereadr.api.databases.delete({
				database_id: 120,
			});

			const form = sentForm();
			expect(form.get('section')).toBe('databases');
			expect(form.get('action')).toBe('delete');
			expect(form.get('database_id')).toBe('120');
			expect(result).toEqual({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('databases.clear sends the clear action, not delete', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.databases.clear({ database_id: 120 });

			const form = sentForm();
			expect(form.get('section')).toBe('databases');
			// clear empties the database; delete removes it. Mixing them up is
			// destructive in a way the response would never reveal.
			expect(form.get('action')).toBe('clear');
			expect(form.get('database_id')).toBe('120');
		} finally {
			testDb.cleanup();
		}
	});

	it('databases.showValues sends its search variables', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.databases.showValues({
				database_id: 120,
				value: 'A1',
				valuelike: 'A',
				response: 'ok',
				responselike: 'o',
				validity: 0,
				limit: 20,
				offset: 5,
			});

			const form = sentForm();
			expect(form.get('section')).toBe('databases');
			expect(form.get('action')).toBe('showvalues');
			expect(form.get('database_id')).toBe('120');
			expect(form.get('value')).toBe('A1');
			expect(form.get('valuelike')).toBe('A');
			expect(form.get('response')).toBe('ok');
			expect(form.get('responselike')).toBe('o');
			expect(form.get('validity')).toBe('0');
			expect(form.get('limit')).toBe('20');
			expect(form.get('offset')).toBe('5');
		} finally {
			testDb.cleanup();
		}
	});

	it('databases.upsertValue sends the value, response and validity', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.databases.upsertValue({
				database_id: 120,
				value: 'A1B2C3D',
				response: 'Admitted',
				validity: 0,
				trim_value: false,
			});

			const form = sentForm();
			expect(form.get('section')).toBe('databases');
			expect(form.get('action')).toBe('upsertvalue');
			expect(form.get('database_id')).toBe('120');
			expect(form.get('value')).toBe('A1B2C3D');
			expect(form.get('response')).toBe('Admitted');
			expect(form.get('validity')).toBe('0');
			expect(form.get('trim_value')).toBe('0');
		} finally {
			testDb.cleanup();
		}
	});

	it('databases.upsertValues indexes each value into the array syntax', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.databases.upsertValues({
				database_id: 120,
				trim_value: true,
				values: [
					{ value: 'A1', response: 'Hall 2', validity: 1 },
					{ value: 'B1', database_id: 121, trim_value: false },
				],
			});

			const form = sentForm();
			expect(form.get('section')).toBe('databases');
			expect(form.get('action')).toBe('upsertmultivalue');
			expect(form.get('database_id')).toBe('120');
			expect(form.get('trim_value')).toBe('1');
			expect(form.get('values[0][value]')).toBe('A1');
			expect(form.get('values[0][response]')).toBe('Hall 2');
			expect(form.get('values[0][validity]')).toBe('1');
			expect(form.get('values[1][value]')).toBe('B1');
			// A per-value database overrides the request-wide one.
			expect(form.get('values[1][database_id]')).toBe('121');
			expect(form.get('values[1][trim_value]')).toBe('0');
		} finally {
			testDb.cleanup();
		}
	});

	it('users.create sends the username, password and device limit', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(CREATED_XML);

			const result = await corsair.codereadr.api.users.create({
				username: 'scanner@example.com',
				password: 'secret',
				device_limit: -1,
			});

			const form = sentForm();
			expect(form.get('section')).toBe('users');
			expect(form.get('action')).toBe('create');
			expect(form.get('username')).toBe('scanner@example.com');
			expect(form.get('password')).toBe('secret');
			// The wire name is `limit`, not `device_limit`.
			expect(form.get('limit')).toBe('-1');
			expect(form.has('device_limit')).toBe(false);
			expect(result).toEqual({ success: true, user_id: 1001 });
		} finally {
			testDb.cleanup();
		}
	});

	it('users.update sends only the fields that were set', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			const result = await corsair.codereadr.api.users.update({
				user_id: 73,
				device_limit: 5,
			});

			const form = sentForm();
			expect(form.get('section')).toBe('users');
			expect(form.get('action')).toBe('update');
			expect(form.get('user_id')).toBe('73');
			expect(form.get('limit')).toBe('5');
			expect(form.has('username')).toBe(false);
			expect(form.has('password')).toBe(false);
			expect(result).toEqual({ success: true, user_id: 73 });
		} finally {
			testDb.cleanup();
		}
	});

	it('users.delete sends the joined IDs', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.users.delete({ user_id: [73, 74] });

			const form = sentForm();
			expect(form.get('section')).toBe('users');
			expect(form.get('action')).toBe('delete');
			expect(form.get('user_id')).toBe('73,74');
		} finally {
			testDb.cleanup();
		}
	});

	it('questions.list and devices.list send their filters', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.questions.list({ question_id: [480] });
			await corsair.codereadr.api.devices.list({ device_id: [73] });

			const questions = sentForm(0);
			expect(questions.get('section')).toBe('questions');
			expect(questions.get('action')).toBe('retrieve');
			expect(questions.get('question_id')).toBe('480');

			const devices = sentForm(1);
			expect(devices.get('section')).toBe('devices');
			expect(devices.get('action')).toBe('retrieve');
			expect(devices.get('device_id')).toBe('73');
		} finally {
			testDb.cleanup();
		}
	});

	it('questions.create sends the text and type', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(CREATED_XML);

			await corsair.codereadr.api.questions.create({
				question_text: 'Which dock?',
				question_type: 'dropdown',
			});

			const form = sentForm();
			expect(form.get('section')).toBe('questions');
			expect(form.get('action')).toBe('create');
			expect(form.get('question_text')).toBe('Which dock?');
			expect(form.get('question_type')).toBe('dropdown');
		} finally {
			testDb.cleanup();
		}
	});

	it('devices.update sends the ID and new name', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			const result = await corsair.codereadr.api.devices.update({
				device_id: 73,
				device_name: 'North gate scanner',
			});

			const form = sentForm();
			expect(form.get('section')).toBe('devices');
			expect(form.get('action')).toBe('update');
			expect(form.get('device_id')).toBe('73');
			expect(form.get('device_name')).toBe('North gate scanner');
			expect(result).toEqual({ success: true, device_id: 73 });
		} finally {
			testDb.cleanup();
		}
	});

	it('uploads.list sends its filters and paging', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.uploads.list({
				service_id: [456],
				device_id: [123],
				user_id: [7800],
				limit: 20,
				offset: 5,
			});

			const form = sentForm();
			expect(form.get('section')).toBe('uploads');
			expect(form.get('action')).toBe('retrieve');
			expect(form.get('service_id')).toBe('456');
			expect(form.get('device_id')).toBe('123');
			expect(form.get('user_id')).toBe('7800');
			expect(form.get('limit')).toBe('20');
			expect(form.get('offset')).toBe('5');
		} finally {
			testDb.cleanup();
		}
	});

	it('limits.retrieve sends only the selector variables', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.limits.retrieve({});

			const form = sentForm();
			expect(form.get('section')).toBe('limits');
			expect(form.get('action')).toBe('retrieve');
			expect([...form.keys()].sort()).toEqual(['action', 'api_key', 'section']);
		} finally {
			testDb.cleanup();
		}
	});
});

/**
 * `offset` only takes effect together with `limit`, and the docs do not say
 * whether the root `<count>` is the rows on this page or every match. Paging
 * has to hold under both readings, or a caller following `next_offset` either
 * re-reads the first page forever or walks empty pages forever.
 */
describe('paging', () => {
	it('scans.list sends the default limit with an offset so the offset applies', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SCANS_XML);

			await corsair.codereadr.api.scans.list({ offset: 10_000 });

			const form = sentForm();
			expect(form.get('offset')).toBe('10000');
			expect(form.get('limit')).toBe('10000');
		} finally {
			testDb.cleanup();
		}
	});

	it('scans.list leaves limit out when there is no offset to anchor', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SCANS_XML);

			await corsair.codereadr.api.scans.list({});

			expect(sentForm().has('limit')).toBe(false);
		} finally {
			testDb.cleanup();
		}
	});

	it('scans.list reports the next offset for a full page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SCANS_XML);

			const result = await corsair.codereadr.api.scans.list({
				limit: 2,
				offset: 4,
			});

			expect(result.next_offset).toBe(6);
		} finally {
			testDb.cleanup();
		}
	});

	it('scans.list stops paging on an empty page even when count is the total', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// A total-style count: 25 matches, none of them on this page.
			respondXml('<xml><status>1</status><count>25</count></xml>');

			const result = await corsair.codereadr.api.scans.list({
				limit: 10,
				offset: 30,
			});

			expect(result.scans).toEqual([]);
			expect(result.next_offset).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('databases.showValues pages on the rows returned, not the count', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(DATABASE_VALUES_XML);
			respondXml('<xml><status>1</status><count>25</count></xml>');

			const full = await corsair.codereadr.api.databases.showValues({
				database_id: 120,
				limit: 2,
			});
			const empty = await corsair.codereadr.api.databases.showValues({
				database_id: 120,
				limit: 2,
				offset: 30,
			});

			expect(full.next_offset).toBe(2);
			expect(empty.next_offset).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('uploads.list pages on the rows returned, not the count', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(UPLOADS_XML);
			respondXml('<xml><status>1</status><count>25</count></xml>');

			const full = await corsair.codereadr.api.uploads.list({ limit: 2 });
			const empty = await corsair.codereadr.api.uploads.list({
				limit: 2,
				offset: 30,
			});

			expect(full.next_offset).toBe(2);
			expect(empty.next_offset).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects an offset without a limit where the API has no default page size', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(
				corsair.codereadr.api.databases.showValues({
					database_id: 120,
					offset: 20,
				}),
			).rejects.toThrow(/limit/);
			await expect(
				corsair.codereadr.api.uploads.list({ offset: 20 }),
			).rejects.toThrow(/limit/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});

describe('inputs and outputs against the reference', () => {
	it('databases.upsertValue requires the database, as the API does', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(
				corsair.codereadr.api.databases.upsertValue(
					// The cast stands in for an untyped caller, such as an agent.
					{ value: 'A1B2C3D' } as never,
				),
			).rejects.toThrow(/database_id/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('services.list keeps a validation method the API adds later', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(
				'<xml><status>1</status><service id="9"><name>Kiosk</name><validationmethod>kiosk</validationmethod></service></xml>',
			);

			const result = await corsair.codereadr.api.services.list({});

			expect(result.services[0]?.validation_method).toBe('kiosk');
		} finally {
			testDb.cleanup();
		}
	});

	it('scans.list accepts the status filter as numbers or strings', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondXml(SCANS_XML);
			respondXml(SCANS_XML);

			await corsair.codereadr.api.scans.list({ status: [1, -1] });
			await corsair.codereadr.api.scans.list({ status: ['0', '1'] });

			expect(sentForm(0).get('status')).toBe('1,-1');
			expect(sentForm(1).get('status')).toBe('0,1');
		} finally {
			testDb.cleanup();
		}
	});
});
