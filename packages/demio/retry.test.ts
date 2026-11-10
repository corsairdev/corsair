import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { demio } from './index';
import {
	dailyLimit,
	eventSummary,
	rateLimited,
	unauthorized,
} from './test-fixtures';

const CREDENTIALS = {
	apiKey: 'demio-test-key',
	apiSecret: 'demio-test-secret',
};

/**
 * Writes the pair onto the account, so the key builder resolves it the way a
 * connected tenant would. No inline `key` is passed: an inline key would skip
 * the credential lookup this file exists to prove.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'demio', 'default');
	const corsair = createCorsair({
		plugins: [demio()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.demio.keys.issue_new_dek();
	await corsair.demio.keys.set_api_key(CREDENTIALS.apiKey);
	await corsair.demio.keys.set_api_secret(CREDENTIALS.apiSecret);
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: each fixture is a plain object of arbitrary shape, and the output
// schema under test is what validates it.
function respondJson(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function calls(): number {
	return fetchMock.mock.calls.length;
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
	jest.useRealTimers();
});

describe('stored credentials', () => {
	// The plugin has no inline key here, so this only passes if the key builder
	// reads both fields the account declares and packs them correctly.
	it('sends both headers read from the account', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson([eventSummary]);

			await corsair.demio.api.events.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('api-key')).toBe(CREDENTIALS.apiKey);
			expect(headers.get('api-secret')).toBe(CREDENTIALS.apiSecret);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails before any request when the secret is missing', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'demio', 'default');
		const corsair = createCorsair({
			plugins: [demio()],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await corsair.demio.keys.issue_new_dek();
		await corsair.demio.keys.set_api_key('only-the-key');
		try {
			await expect(corsair.demio.api.events.list({})).rejects.toThrow(
				/auth-missing:demio:api_key/,
			);
			expect(calls()).toBe(0);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('retry behaviour', () => {
	// Demio answers 417, not 429. The transport does not recognise 417 on its
	// own, so this retry only happens if the client's rate-limit config names it.
	// No Retry-After here, so the documented one-minute window is the delay.
	it('retries a 417 and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson(rateLimited, 417);
			respondJson([eventSummary]);

			const pending = corsair.demio.api.events.list({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(60_100);
			const result = await pending;

			expect(result).toHaveLength(1);
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	// Without a fallback the binder's one-second default retries inside the same
	// minute and fails again, which spends an attempt for nothing.
	it('waits the documented minute when no Retry-After is sent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson(rateLimited, 417);
			respondJson([eventSummary]);

			const pending = corsair.demio.api.events.list({});
			await Promise.resolve();
			await Promise.resolve();
			// Past the binder's one-second default and still inside the minute.
			await jest.advanceTimersByTimeAsync(30_000);
			expect(calls()).toBe(1);

			await jest.advanceTimersByTimeAsync(31_000);
			await pending;
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('honours a Retry-After header on a 417', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson(rateLimited, 417, { 'Retry-After': '2' });
			respondJson([eventSummary]);

			const pending = corsair.demio.api.events.list({});
			await Promise.resolve();
			await Promise.resolve();
			// Short of the requested wait, nothing has retried.
			await jest.advanceTimersByTimeAsync(1_000);
			expect(calls()).toBe(1);

			await jest.advanceTimersByTimeAsync(1_500);
			await pending;
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson(rateLimited, 417);
			respondJson(rateLimited, 417);
			respondJson(rateLimited, 417);

			const pending = corsair.demio.api.events
				.list({})
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the field it checks.
				.catch((caught: unknown) => caught);
			for (let step = 0; step < 4; step++) {
				await Promise.resolve();
				await jest.advanceTimersByTimeAsync(60_100);
			}
			const error = await pending;

			expect(error).toMatchObject({ status: 417 });
			expect(calls()).toBe(3);
		} finally {
			testDb.cleanup();
		}
	});

	// The daily allowance is spent for the day, so retrying spends three
	// attempts on a failure that cannot clear.
	it('never retries the daily allowance', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(dailyLimit, 417);

			await expect(corsair.demio.api.events.list({})).rejects.toMatchObject({
				status: 417,
			});
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ errors: ['Something went wrong'] }, 500);
			respondJson([eventSummary]);

			const pending = corsair.demio.api.events.list({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(1_100);
			const result = await pending;

			expect(result).toHaveLength(1);
			expect(calls()).toBe(2);
		} finally {
			testDb.cleanup();
		}
	});

	// A registrant may already exist at Demio after a failed call, and the API
	// takes no idempotency key, so a replay could register the same person twice.
	it('never replays a registration', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ errors: ['Something went wrong'] }, 500);

			await expect(
				corsair.demio.api.registrations.create({
					id: 86,
					name: 'Jane Doe',
					email: 'jane@example.com',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected credential', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(unauthorized, 401);

			await expect(corsair.demio.api.events.list({})).rejects.toMatchObject({
				status: 401,
			});
			expect(calls()).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});
});
