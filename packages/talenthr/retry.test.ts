import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { talenthr } from './index';
import { directoryResponse, employeeResponse } from './test-fixtures';

/**
 * `endpoints.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer runs: it is the only
 * place a 429 can be retried at all.
 *
 * Reads replay after a 5xx, writes never do. Repeating `employees.hire` or
 * `timeOff.create` would create a second record.
 */

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'talenthr', 'default');
	const corsair = createCorsair({
		plugins: [talenthr({ key: 'talenthr-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
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

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('rate-limit retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429, { 'Retry-After': '1' });
			respond(directoryResponse);

			const result = await corsair.talenthr.api.employees.directory({
				limit: 10,
			});

			expect(result.rows).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 3 retries, so 4 attempts in total.
			for (let i = 0; i < 4; i += 1) {
				respond({ message: 'Too many requests' }, 429);
			}

			await expect(
				corsair.talenthr.api.employees.directory({ limit: 10 }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});

describe('fake-timer delay pinning', () => {
	it('waits the documented window when a 429 carries no Retry-After', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429);
			respond(directoryResponse);

			// Fake timers start after the client exists, so the database setup
			// and the encrypted writes never run on a fake clock.
			jest.useFakeTimers();
			const pending = corsair.talenthr.api.employees.directory({ limit: 10 });

			// The first attempt is immediate; the retry waits on a timer.
			await jest.advanceTimersByTimeAsync(0);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_000);
			await expect(pending).resolves.toMatchObject({ total: 1 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	}, 30_000);
});

describe('server-error replay safety', () => {
	it('returns the retried read rather than the failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error' }, 500);
			respond(employeeResponse);

			const result = await corsair.talenthr.api.employees.get({
				employeeId: 15,
			});

			expect(result.id).toBe(15);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('never replays a write on 5xx, because the first attempt may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error' }, 500);

			await expect(
				corsair.talenthr.api.employees.hire({
					first_name: 'John',
					last_name: 'Doe',
					email: 'john.doe@example.com',
					hire_date: '2024-02-29',
					employment_status: { employment_status_id: 1 },
					reports_to_employee_id: 15,
				}),
			).rejects.toMatchObject({ status: 500 });

			// Exactly one attempt: a second hire would create a second employee.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
