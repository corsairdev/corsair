import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ntfy } from './index';
import { publishedMessage } from './test-fixtures';

/**
 * Core's request() has maxRetries: 0 for this plugin; `error-handlers.ts`
 * owns every retry. Publishes are not idempotent, so 5xx replays are gated
 * on GET.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'ntfy', 'default');
	const corsair = createCorsair({
		plugins: [ntfy({ key: 'tk_0123456789abcdefghij0123456789' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or NDJSON text.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string'
						? 'application/x-ndjson; charset=utf-8'
						: 'application/json',
				...headers,
			},
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('retries a rate-limited publish after Retry-After', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 42901, http: 429, error: 'limit' }, 429, {
				'Retry-After': '1',
			});
			respond(publishedMessage);

			const result = await corsair.ntfy.api.messages.send({ topic: 't' });

			expect(result).toMatchObject({ id: publishedMessage.id });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 3; i += 1) {
				respond({ code: 42901, http: 429, error: 'limit' }, 429);
			}

			await expect(
				corsair.ntfy.api.messages.poll({ topic: 't' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a failed read on a 503 but never a write', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 50001, http: 500, error: 'internal error' }, 503);
			respond({ healthy: true, role: 'active' });

			const result = await corsair.ntfy.api.server.health({});

			expect(result).toEqual({ healthy: true, role: 'active' });
			expect(fetchMock).toHaveBeenCalledTimes(2);

			respond({ code: 50001, http: 500, error: 'internal error' }, 503);
			await expect(
				corsair.ntfy.api.messages.clear({ topic: 't', sequenceId: 's' }),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('never retries a spent daily message quota', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ code: 42908, http: 429, error: 'daily message quota reached' },
				429,
			);
			await expect(
				corsair.ntfy.api.messages.send({ topic: 't', message: 'm' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a dropped connection, read or write', async () => {
		const { corsair, testDb } = await createClient();
		const dropped = () => {
			throw new Error('fetch failed');
		};
		try {
			fetchMock.mockImplementationOnce(dropped);
			await expect(corsair.ntfy.api.server.health({})).rejects.toThrow(
				'fetch failed',
			);

			fetchMock.mockImplementationOnce(dropped);
			await expect(
				corsair.ntfy.api.messages.send({ topic: 't', message: 'm' }),
			).rejects.toThrow('fetch failed');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out the no-header backoff delay with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 42901, http: 429, error: 'limit' }, 429);
			respond({ healthy: true, role: 'active' });

			const pending = corsair.ntfy.api.server.health({});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toEqual({ healthy: true, role: 'active' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
