import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { DeskTimeAPIError } from './client';
import { desktime } from './index';
import {
	COMPANY_BODY,
	EMPLOYEE,
	EMPLOYEES_BODY,
	INVALID_KEY_ERROR,
	MISSING_KEY_ERROR,
	PING_BODY,
} from './test-fixtures';

async function createClient(options: Parameters<typeof desktime>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'desktime', 'default');
	const corsair = createCorsair({
		plugins: [desktime(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/**
 * Queues one JSON response. `body` is unknown because each fixture is a plain
 * object of arbitrary shape; the output schema under test is what validates it,
 * so a per-call-site type would add ceremony without adding a check.
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
	// A call no test queued a response for must fail here, never reach the
	// network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch: queue a response for every request');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('DeskTime plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.desktime.keys.issue_new_dek();
			await expect(corsair.desktime.api.company.get({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.desktime.keys.issue_new_dek();
			await corsair.desktime.keys.set_api_key('desktime-stored-key');
			respondJson(COMPANY_BODY);

			await corsair.desktime.api.company.get({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('X-API-Key')).toBe(
				'desktime-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers an inline key over the stored one', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			await corsair.desktime.keys.issue_new_dek();
			await corsair.desktime.keys.set_api_key('stored-key');
			respondJson(COMPANY_BODY);

			await corsair.desktime.api.company.get({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('X-API-Key')).toBe('inline-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('reaches ping with a configured key, the cheapest check that a key works', async () => {
		const { corsair, testDb } = await createClient({
			key: 'desktime-test-key',
		});
		try {
			respondJson(PING_BODY);

			const result = await corsair.desktime.api.ping.get({});

			expect(result.pong).toBe('1794135987');
			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('X-API-Key')).toBe(
				'desktime-test-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads employees for a day', async () => {
		const { corsair, testDb } = await createClient({
			key: 'desktime-test-key',
		});
		try {
			respondJson(EMPLOYEES_BODY);

			const result = await corsair.desktime.api.employees.list({
				date: '2026-11-08',
			});

			expect(result.buckets).toHaveLength(1);
			expect(result.buckets[0]?.employees[0]?.name).toBe('corsair test');
		} finally {
			testDb.cleanup();
		}
	});

	it('reads one employee, accepting the false arrival the API sends', async () => {
		const { corsair, testDb } = await createClient({
			key: 'desktime-test-key',
		});
		try {
			respondJson(EMPLOYEE);

			const result = await corsair.desktime.api.employee.basic({ id: 789760 });

			expect(result.arrived).toBe(false);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a missing key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respondJson(MISSING_KEY_ERROR, 401);

			// unknown: a rejection can be any value until instanceof narrows it.
			const error = await corsair.desktime.api.company
				.get({})
				.catch((caught: unknown) => caught);

			expect(error).toBeInstanceOf(DeskTimeAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respondJson(INVALID_KEY_ERROR, 401);

			await expect(
				corsair.desktime.api.projects.list({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
