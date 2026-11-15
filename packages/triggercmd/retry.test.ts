import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { triggercmd } from './index';
import {
	computersEnvelope,
	runsEnvelope,
	triggerAccepted,
} from './test-fixtures';

/**
 * Core's request() retries a 429 three times with Retry-After;
 * `error-handlers.ts` decides what else is retried.
 *
 * A command run is never replayed on a 5xx: it starts a process on a computer,
 * so a replay could run it twice.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'triggercmd', 'default');
	const corsair = createCorsair({
		plugins: [triggercmd({ key: 'tc-test-token' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
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

describe('retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ err: 'slow down' }, 429, { 'Retry-After': '1' });
			respond(computersEnvelope);

			const result = await corsair.triggercmd.api.computers.list({});

			expect(result.records).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({}, 429);
			}

			await expect(
				corsair.triggercmd.api.computers.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not replay a command run on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 500);

			await expect(
				corsair.triggercmd.api.commands.run({
					computer: 'laptop',
					trigger: 'notepad',
				}),
			).rejects.toMatchObject({ status: 500 });
			// One attempt: a replay could start the process twice.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a panel trigger on a 5xx, though it is a GET', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 503);

			await expect(
				corsair.triggercmd.api.panels.trigger({
					panel: 'Living room',
					button: 'Lights off',
				}),
			).rejects.toMatchObject({ status: 503 });
			// One attempt: the button runs a command on a computer.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 503);
			respond(runsEnvelope);

			const result = await corsair.triggercmd.api.commands.history({
				command_id: 101,
			});

			expect(result.records).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ err: 'Invalid Token!' }, 401);

			await expect(
				corsair.triggercmd.api.computers.list({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a command run normally when it succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(triggerAccepted);

			const result = await corsair.triggercmd.api.commands.run({
				computer: 'laptop',
				trigger: 'notepad',
				params: 'MyNote',
			});

			expect(result.result).toBe('success');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429, { 'Retry-After': '2' });
			respond(computersEnvelope);

			const pending = corsair.triggercmd.api.computers.list({});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toMatchObject({
				records: [expect.anything(), expect.anything()],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the strategy delay when there is no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429);
			respond(computersEnvelope);

			const pending = corsair.triggercmd.api.computers.list({});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({
				records: [expect.anything(), expect.anything()],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
