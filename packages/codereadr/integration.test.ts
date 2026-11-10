import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { CodereadrAPIError } from './client';
import { codereadr } from './index';
import {
	API_KEY_ERROR_XML,
	CREATED_XML,
	LIMITS_XML,
	SCANS_XML,
	SUCCESS_XML,
	TRANSIENT_ERROR_XML,
} from './test-fixtures';

async function createClient(options: Parameters<typeof codereadr>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'codereadr', 'default');
	const corsair = createCorsair({
		plugins: [codereadr(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** Queues one XML answer, since every CodeREADr response is XML. */
function respondXml(body: string, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, {
			status,
			headers: { 'Content-Type': 'text/xml; charset=utf-8' },
		}),
	);
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

describe('CodeREADr plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.codereadr.keys.issue_new_dek();
			await expect(corsair.codereadr.api.scans.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account, in the form body', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.codereadr.keys.issue_new_dek();
			await corsair.codereadr.keys.set_api_key('codereadr-stored-key');
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.limits.retrieve({});

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const form = new URLSearchParams(String(init.body));
			expect(form.get('api_key')).toBe('codereadr-stored-key');
			// The key never rides in the URL: the docs say a query key is unsafe.
			expect(url).not.toContain('codereadr-stored-key');
			expect(url).not.toContain('?');
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers an inline key over the stored one', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'codereadr', 'default');
		const corsair = createCorsair({
			plugins: [codereadr({ key: 'inline-key' })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		try {
			await corsair.codereadr.keys.issue_new_dek();
			await corsair.codereadr.keys.set_api_key('stored-key');
			respondXml(SUCCESS_XML);

			await corsair.codereadr.api.limits.retrieve({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const form = new URLSearchParams(String(init.body));
			expect(form.get('api_key')).toBe('inline-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('lists scans with the configured key', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(SCANS_XML);

			const result = await corsair.codereadr.api.scans.list({ limit: 2 });

			expect(result.scans).toHaveLength(2);
			expect(result.scans[0]?.barcode_value).toBe('A1B2C3D');
			expect(result.count).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends filtered list variables in their documented names', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(SCANS_XML);

			await corsair.codereadr.api.scans.list({
				service_id: [1005, 1010],
				status: ['1', '0'],
				show_properties: true,
				with_property: { mode: 'auto' },
				limit: 20,
				offset: 5,
			});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const form = new URLSearchParams(String(init.body));
			expect(form.get('service_id')).toBe('1005,1010');
			expect(form.get('status')).toBe('1,0');
			expect(form.get('showProperties')).toBe('1');
			expect(form.get('with_property[mode]')).toBe('auto');
			expect(form.get('limit')).toBe('20');
			expect(form.get('offset')).toBe('5');
		} finally {
			testDb.cleanup();
		}
	});

	it('reports the next offset for a full page', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
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

	it('leaves the next offset unset when the page is short', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(SCANS_XML);

			const result = await corsair.codereadr.api.scans.list({ limit: 50 });

			expect(result.next_offset).toBeUndefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('returns the ID of a created record', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(CREATED_XML);

			const result = await corsair.codereadr.api.databases.create({
				database_name: 'Tickets',
			});

			expect(result.database_id).toBe(1001);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads the account API limits', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(LIMITS_XML);

			const result = await corsair.codereadr.api.limits.retrieve({});

			expect(result.minute).toEqual({ left: 18, limit: 30 });
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid key', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-bad-key',
		});
		try {
			respondXml(API_KEY_ERROR_XML);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.codereadr.api.scans
				.list({})
				.catch((caught: unknown) => caught);

			expect(error).toBeInstanceOf(CodereadrAPIError);
			expect(error).toMatchObject({ code: 101 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected variable', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(
				'<xml><status>0</status><error code="120">Invalid section Parameter</error></xml>',
			);

			await expect(corsair.codereadr.api.scans.list({})).rejects.toMatchObject({
				code: 120,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write after the provider transient failure', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(TRANSIENT_ERROR_XML);

			await expect(
				corsair.codereadr.api.scans.delete({ scan_id: [1] }),
			).rejects.toMatchObject({ code: 2 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after the provider transient failure', async () => {
		const { corsair, testDb } = await createClient({
			key: 'codereadr-test-key',
		});
		try {
			respondXml(TRANSIENT_ERROR_XML);
			respondXml(SCANS_XML);

			const result = await corsair.codereadr.api.scans.list({});

			expect(result.scans).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
