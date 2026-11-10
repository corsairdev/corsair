import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { teamcamp } from './index';
import { captureError } from './test-errors';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'teamcamp', 'default');
	const corsair = createCorsair({
		plugins: [teamcamp()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.teamcamp.keys.issue_new_dek();
	await corsair.teamcamp.keys.set_api_key('tc-test-key');
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are a bare array, an object, or a bare JSON string.
function respond(
	raw: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof raw === 'string' ? raw : JSON.stringify(raw), {
			status,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				...headers,
			},
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Teamcamp retries through createCorsair', () => {
	it('retries a 429 and succeeds after the backoff', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'slow down' }, 429);
			respond([]);

			const pending = corsair.teamcamp.api.projects.list({});
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result.projects).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++)
				respond({ error: 'slow' }, 429);

			const pending = captureError(corsair.teamcamp.api.projects.list({}));
			await jest.advanceTimersByTimeAsync(20_000);
			const error = await pending;

			expect(error).toBeInstanceOf(Error);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('never replays a project delete on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'boom' }, 500);

			const error = await captureError(
				corsair.teamcamp.api.projects.delete({ projectId: 'p1' }),
			);

			expect(error).toBeInstanceOf(Error);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does retry a read on a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'boom' }, 503);
			respond([]);

			const pending = corsair.teamcamp.api.projects.list({});
			await jest.advanceTimersByTimeAsync(1000);
			const result = await pending;

			expect(result.projects).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('does not retry a bad parameter', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'ProjectId is required' }, 400);

			const error = await captureError(
				corsair.teamcamp.api.tasks.list({
					projectId: 'p1',
				}),
			);

			expect((error as Error).message).toContain('ProjectId is required');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a missing project as a missing resource, not a bad key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// A valid key, an unknown project: Teamcamp answers its invalid-key 403.
			respond('"Invalid API key!!!"', 403);

			const error = await captureError(
				corsair.teamcamp.api.tasks.list({ projectId: 'nope' }),
			);

			expect((error as Error).message).toContain('does not exist');
			// One attempt: a key problem would not fix itself on a retry either.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
