import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { MemberSpotAPIError } from './client';
import { memberspot } from './index';
import {
	AUTH_CHECK_BODY,
	errorBody,
	INVALID_KEY_ERROR,
	USERS_LIST_BODY,
} from './test-fixtures';

async function createClient(options: Parameters<typeof memberspot>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'memberspot', 'default');
	const corsair = createCorsair({
		plugins: [memberspot(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/**
 * Queues one JSON response. `body` is unknown because each fixture is a plain
 * object of arbitrary shape, validated by the output schema under test.
 */
function respondJson(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	// A call with no queued response throws instead of reaching MemberSpot.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('MemberSpot plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.memberspot.keys.issue_new_dek();
			await expect(corsair.memberspot.api.auth.check({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key in the X-API-KEY header', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.memberspot.keys.issue_new_dek();
			await corsair.memberspot.keys.set_api_key('memberspot-stored-key');
			respondJson(AUTH_CHECK_BODY);

			await corsair.memberspot.api.auth.check({});

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('X-API-KEY')).toBe(
				'memberspot-stored-key',
			);
			expect(url).not.toContain('memberspot-stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers an inline key over the stored one', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			await corsair.memberspot.keys.issue_new_dek();
			await corsair.memberspot.keys.set_api_key('stored-key');
			respondJson(AUTH_CHECK_BODY);

			await corsair.memberspot.api.auth.check({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('X-API-KEY')).toBe('inline-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('reads a page of users', async () => {
		const { corsair, testDb } = await createClient({
			key: 'memberspot-test-key',
		});
		try {
			respondJson(USERS_LIST_BODY);

			const result = await corsair.memberspot.api.users.list({
				pageLength: 10,
			});

			expect(result.data).toHaveLength(1);
			expect(result.nextPage).toBe('cursor-2');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respondJson(INVALID_KEY_ERROR, 401);

			// unknown: a rejection can be any value until instanceof narrows it.
			const error = await corsair.memberspot.api.auth
				.check({})
				.catch((caught: unknown) => caught);

			expect(error).toBeInstanceOf(MemberSpotAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400 for a missing key', async () => {
		// A non-empty key is needed to reach the request at all; MemberSpot answers
		// 400 rather than 401 when it considers the key missing.
		const { corsair, testDb } = await createClient({ key: 'empty-ish-key' });
		try {
			respondJson(errorBody(400, 'API key is missing'), 400);

			await expect(corsair.memberspot.api.auth.check({})).rejects.toMatchObject(
				{ status: 400 },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
