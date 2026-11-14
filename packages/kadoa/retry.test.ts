import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { kadoa } from './index';
import { jobFinished, unauthorized, workflowsList } from './test-fixtures';

async function createClient(options: Parameters<typeof kadoa>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'kadoa', 'default');
	const corsair = createCorsair({
		plugins: [kadoa(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and
	// send a live request, so every call a test did not stub fails instead.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response with respond first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers can step
 * over the backoff instead of waiting for it.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	for (let step = 0; step < 10 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(5_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a 429 and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			respond({ error: 'Too many requests', reason: 'USER_RATE_LIMIT' }, 429);
			respond(workflowsList);

			const result = await withFakeTimers(corsair.kadoa.api.workflows.list({}));

			expect(result.workflows).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			respond({ error: 'Too many requests', reason: 'PIPELINE_CROWDED' }, 429);
			respond({ error: 'Too many requests', reason: 'PIPELINE_CROWDED' }, 429);
			respond({ error: 'Too many requests', reason: 'PIPELINE_CROWDED' }, 429);
			respond({ error: 'Too many requests', reason: 'PIPELINE_CROWDED' }, 429);

			const error = await withFakeTimers(
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the fields it checks.
				corsair.kadoa.api.workflows
					.run({ workflowId: 'wf_01HZX6' })
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({
				status: 429,
				body: { reason: 'PIPELINE_CROWDED' },
			});
			// One attempt plus three retries.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			respond({ error: 'Internal service error' }, 500);

			await expect(
				corsair.kadoa.api.workflows.run({ workflowId: 'wf_01HZX6' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a delete after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			respond({ error: 'Bad gateway' }, 502);

			await expect(
				corsair.kadoa.api.schemas.delete({ schemaId: 'sch_01HZX8' }),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			respond({ error: 'Internal service error' }, 500);
			respond(jobFinished);

			const result = await withFakeTimers(
				corsair.kadoa.api.workflows.jobStatus({
					workflowId: 'wf_01HZX6',
					jobId: 'job_01HZX7',
				}),
			);

			expect(result.state).toBe('FINISHED');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an auth failure', async () => {
		const { corsair, testDb } = await createClient({ key: 'tk-bad-key' });
		try {
			respond(unauthorized, 401);

			await expect(corsair.kadoa.api.workflows.list({})).rejects.toMatchObject({
				status: 401,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('honors a Retry-After header instead of its fallback delay', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify({ error: 'Slow down' }), {
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '2' },
				}),
			);
			respond(workflowsList);

			const pending = corsair.kadoa.api.workflows.list({});
			await Promise.resolve();
			await Promise.resolve();
			// Under the requested wait it has not retried yet.
			await jest.advanceTimersByTimeAsync(1_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_500);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('falls back to one second when the 429 carries no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			respond({ error: 'Too many requests' }, 429);
			respond(workflowsList);

			const pending = corsair.kadoa.api.workflows.list({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(200);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a dropped connection on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(workflowsList);

			const result = await withFakeTimers(corsair.kadoa.api.workflows.list({}));

			expect(result.workflows).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a dropped connection on a write', async () => {
		const { corsair, testDb } = await createClient({ key: 'tk-test-key' });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.kadoa.api.workflows.create({
					urls: ['https://acme.example/p'],
					userPrompt: 'Collect every product and its price.',
				}),
			).rejects.toMatchObject({ transport: true, method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
