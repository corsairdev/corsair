/**
 * Unit test suite for Turso integration plugin endpoints.
 *
 * Tests all registered endpoint operations (`regions.closest`, `tokens.validate`,
 * `changes.listen`), credential resolution, host security, fallback behaviors,
 * and database change event mirroring.
 */

import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { TursoAPIError } from './client';
import { Changes, Regions, Tokens } from './endpoints';
import type { TursoContext, TursoKeyBuilderContext } from './index';
import { turso } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const TEST_TOKEN = 'test-turso-token-123';
const DB_URL = 'https://mydb-myorg.turso.io';

const ctx: TursoContext = {
	key: TEST_TOKEN,
	options: {},
} as unknown as TursoContext;

const originalFetch = global.fetch;

beforeEach(() => {
	mockLog.mockClear();
	global.fetch = jest.fn();
});

afterAll(() => {
	global.fetch = originalFetch;
});

const mockFetch = (): jest.MockedFunction<typeof fetch> =>
	global.fetch as jest.MockedFunction<typeof fetch>;

/**
 * Creates a mock JSON Response object.
 *
 * @param payload - The response body to serialize as JSON.
 * @param status - The HTTP response status code (default: 200).
 * @returns A mocked Response instance.
 */
function jsonResponse(payload: unknown, status: number = 200): Response {
	return {
		ok: status >= 200 && status < 300,
		status,
		headers: new Headers({ 'content-type': 'application/json' }),
		json: async (): Promise<unknown> => payload,
		text: async (): Promise<string> => JSON.stringify(payload),
	} as Response;
}

/**
 * Builds a Response whose body streams the given SSE chunks.
 *
 * @param chunks - Array of raw SSE text chunks to stream.
 * @returns A mocked Response with a readable stream body.
 */
function sseResponse(chunks: string[]): Response {
	const encoder = new TextEncoder();
	let i = 0;
	return {
		ok: true,
		status: 200,
		headers: new Headers({ 'content-type': 'text/event-stream' }),
		body: {
			getReader: () => ({
				read: async (): Promise<{
					done: boolean;
					value: Uint8Array | undefined;
				}> =>
					i < chunks.length
						? { done: false, value: encoder.encode(chunks[i++]) }
						: { done: true, value: undefined },
				cancel: async (): Promise<void> => undefined,
			}),
		},
	} as unknown as Response;
}

describe('plugin shape', () => {
	it('registers the three claimed operations and no webhooks', () => {
		const plugin = turso();
		expect(plugin.id).toBe('turso');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(plugin.endpoints ?? {})).toEqual([
			'regions',
			'tokens',
			'changes',
		]);
		expect(typeof plugin.endpoints?.regions?.closest).toBe('function');
		expect(typeof plugin.endpoints?.tokens?.validate).toBe('function');
		expect(typeof plugin.endpoints?.changes?.listen).toBe('function');
	});

	it('declares the changeEvents entity', () => {
		expect(Object.keys(turso().schema?.entities ?? {})).toEqual([
			'changeEvents',
		]);
	});

	it('resolves the token from options or context and rejects webhook lookup', async () => {
		await expect(
			turso({ key: TEST_TOKEN }).keyBuilder?.(
				{ authType: 'api_key' } as never,
				'endpoint',
			),
		).resolves.toBe(TEST_TOKEN);

		const plugin = turso();
		const stored = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(TEST_TOKEN) },
		};
		await expect(
			plugin.keyBuilder?.(
				stored as unknown as TursoKeyBuilderContext,
				'endpoint',
			),
		).resolves.toBe(TEST_TOKEN);

		// A missing credential must raise, not resolve to an empty string.
		const empty = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(null) },
		};
		await expect(
			plugin.keyBuilder?.(
				empty as unknown as TursoKeyBuilderContext,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);

		await expect(
			(
				plugin.keyBuilder as unknown as (
					ctx: unknown,
					source: string,
				) => Promise<string>
			)?.(stored, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('Regions.closest', () => {
	it('calls the unauthenticated region service and returns both codes', async () => {
		mockFetch().mockResolvedValueOnce(
			jsonResponse({ server: 'aws-ap-northeast-1', client: 'sin' }),
		);

		const result = await Regions.closest(ctx, {});

		expect(result).toEqual({ server: 'aws-ap-northeast-1', client: 'sin' });

		const [calledUrl, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe('https://region.turso.io');
		expect(calledOptions?.method).toBe('GET');
		// The service is unauthenticated — no credential should be attached.
		expect(
			(calledOptions?.headers as Record<string, string>).Authorization,
		).toBeUndefined();

		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'turso.regions.closest',
			{},
			'completed',
		);
	});

	it('rejects a malformed region payload', async () => {
		mockFetch().mockResolvedValueOnce(jsonResponse({ server: 'lhr' }));
		await expect(Regions.closest(ctx, {})).rejects.toThrow();
	});
});

describe('Tokens.validate', () => {
	it('returns -1 for a token that never expires', async () => {
		mockFetch().mockResolvedValueOnce(jsonResponse({ exp: -1 }));

		const result = await Tokens.validate(ctx, {});

		expect(result).toEqual({ exp: -1 });

		const [calledUrl, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe('https://api.turso.tech/v1/auth/validate');
		expect(
			(calledOptions?.headers as Record<string, string>).Authorization,
		).toBe(`Bearer ${TEST_TOKEN}`);
	});

	it('returns an epoch expiry for a token that does expire', async () => {
		mockFetch().mockResolvedValueOnce(jsonResponse({ exp: 1789000000 }));
		await expect(Tokens.validate(ctx, {})).resolves.toEqual({
			exp: 1789000000,
		});
	});

	it('logs only the expiry, never the token', async () => {
		mockFetch().mockResolvedValueOnce(jsonResponse({ exp: -1 }));

		await Tokens.validate(ctx, {});

		const meta = mockLog.mock.calls[0]![2] as Record<string, unknown>;
		expect(meta).toEqual({ exp: -1 });
		expect(JSON.stringify(meta)).not.toContain(TEST_TOKEN);
	});

	it('throws AuthMissingError without calling fetch when no key is resolved', async () => {
		const empty = { key: '', options: {} } as unknown as TursoContext;
		await expect(Tokens.validate(empty, {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('surfaces the provider message on an auth failure', async () => {
		mockFetch().mockResolvedValueOnce(
			jsonResponse({ error: 'could not validate token' }, 401),
		);
		await expect(Tokens.validate(ctx, {})).rejects.toThrow(
			'could not validate token',
		);
	});

	it('rejects a non-integer expiry', async () => {
		mockFetch().mockResolvedValueOnce(jsonResponse({ exp: 'never' }));
		await expect(Tokens.validate(ctx, {})).rejects.toThrow();
	});
});

describe('Changes.listen', () => {
	it('streams committed events and stops at maxEvents', async () => {
		mockFetch().mockResolvedValueOnce(
			sseResponse([
				'data: {"id":1,"name":"a"}\n\n',
				'data: {"id":2,"name":"b"}\n\n',
				'data: {"id":3,"name":"c"}\n\n',
			]),
		);

		const result = await Changes.listen(ctx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
			maxEvents: 2,
		});

		expect(result.mode).toBe('stream');
		if (result.mode !== 'stream') throw new Error('expected stream');
		expect(result.events).toHaveLength(2);
		expect(result.stoppedBy).toBe('max_events');
		expect(result.events[0]!.data).toEqual({ id: 1, name: 'a' });
		expect(result.events[0]!.table).toBe('users');
		expect(result.events[0]!.action).toBe('insert');

		const [calledUrl] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe(
			'https://mydb-myorg.turso.io/beta/listen?table=users&action=insert',
		);
	});

	it('handles an SSE frame split across chunks', async () => {
		mockFetch().mockResolvedValueOnce(
			sseResponse(['data: {"id":1,', '"name":"split"}\n\n']),
		);

		const result = await Changes.listen(ctx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'update',
			maxEvents: 5,
		});

		if (result.mode !== 'stream') throw new Error('expected stream');
		expect(result.events).toHaveLength(1);
		expect(result.events[0]!.data).toEqual({ id: 1, name: 'split' });
		expect(result.stoppedBy).toBe('stream_closed');
	});

	it('preserves a non-JSON payload rather than dropping it', async () => {
		mockFetch().mockResolvedValueOnce(sseResponse(['data: plain-text\n\n']));

		const result = await Changes.listen(ctx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'delete',
		});

		if (result.mode !== 'stream') throw new Error('expected stream');
		expect(result.events[0]!.data).toEqual({ raw: 'plain-text' });
	});

	it('falls back to a pipeline health check when listen is unavailable', async () => {
		// Documented case: not offered on AWS for Free/Developer/Scaler plans.
		mockFetch()
			.mockResolvedValueOnce(jsonResponse({ error: 'not available' }, 403))
			.mockResolvedValueOnce(jsonResponse({ baton: null, results: [] }));

		const result = await Changes.listen(ctx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
		});

		expect(result).toMatchObject({
			mode: 'health_check',
			listenAvailable: false,
			databaseReachable: true,
			table: 'users',
			action: 'insert',
		});
		if (result.mode !== 'health_check') throw new Error('expected fallback');
		expect(result.reason).toContain('403');

		const [healthUrl, healthOptions] = mockFetch().mock.calls[1]!;
		expect(healthUrl).toBe('https://mydb-myorg.turso.io/v2/pipeline');
		expect(healthOptions?.method).toBe('POST');
	});

	it('reports the database unreachable when the fallback probe also fails', async () => {
		mockFetch()
			.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 404))
			.mockResolvedValueOnce(jsonResponse({ error: 'down' }, 500));

		const result = await Changes.listen(ctx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
		});

		expect(result).toMatchObject({
			mode: 'health_check',
			databaseReachable: false,
		});
	});

	it('raises rather than falling back on an unexpected status', async () => {
		mockFetch().mockResolvedValueOnce(jsonResponse({ error: 'boom' }, 500));

		await expect(
			Changes.listen(ctx, {
				databaseUrl: DB_URL,
				table: 'users',
				action: 'insert',
			}),
		).rejects.toBeInstanceOf(TursoAPIError);
	});

	it('rejects the platform API host, which does not serve the stream', async () => {
		await expect(
			Changes.listen(ctx, {
				databaseUrl: 'not-a-url',
				table: 'users',
				action: 'insert',
			}),
		).rejects.toThrow();
		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('refuses to send the bearer token to a non-Turso host', async () => {
		// The token is attached to databaseUrl, so an attacker-named host would
		// otherwise harvest it.
		const hostile = [
			'https://evil.com',
			'https://evil-turso.io',
			'https://turso.io.evil.com',
			'http://mydb-myorg.turso.io',
			'https://mydb-myorg.turso.io.attacker.net',
		];
		for (const databaseUrl of hostile) {
			await expect(
				Changes.listen(ctx, { databaseUrl, table: 'users', action: 'insert' }),
			).rejects.toThrow();
		}
		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('accepts legitimate Turso database hosts', async () => {
		for (const databaseUrl of [
			'https://mydb-myorg.turso.io',
			'https://abc123-mydb-myorg.turso.io',
		]) {
			mockFetch().mockResolvedValueOnce(sseResponse([]));
			await expect(
				Changes.listen(ctx, { databaseUrl, table: 'users', action: 'insert' }),
			).resolves.toMatchObject({ mode: 'stream' });
		}
	});

	it('enforces input validation on table, action and bounds', async () => {
		const bad = [
			{ databaseUrl: DB_URL, table: '', action: 'insert' as const },
			{ databaseUrl: DB_URL, table: 'users', action: 'upsert' as never },
			{
				databaseUrl: DB_URL,
				table: 'users',
				action: 'insert' as const,
				maxEvents: 0,
			},
			{
				databaseUrl: DB_URL,
				table: 'users',
				action: 'insert' as const,
				timeoutMs: 100,
			},
		];
		for (const input of bad) {
			await expect(Changes.listen(ctx, input)).rejects.toThrow();
		}
		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError without calling fetch when no key is resolved', async () => {
		const empty = { key: '', options: {} } as unknown as TursoContext;
		await expect(
			Changes.listen(empty, {
				databaseUrl: DB_URL,
				table: 'users',
				action: 'insert',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('uses a database auth token for the database host when configured', async () => {
		const dbCtx = {
			key: TEST_TOKEN,
			options: { databaseToken: 'db-scoped-token' },
		} as unknown as TursoContext;

		mockFetch().mockResolvedValueOnce(sseResponse([]));

		await Changes.listen(dbCtx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
		});

		const [, opts] = mockFetch().mock.calls[0]!;
		expect((opts?.headers as Record<string, string>).Authorization).toBe(
			'Bearer db-scoped-token',
		);
	});

	it('uses a stored tenant-scoped database token when configured in key manager', async () => {
		const dbCtx = {
			key: TEST_TOKEN,
			options: {},
			keys: {
				get_database_token: jest
					.fn()
					.mockResolvedValue('stored-tenant-db-token'),
			},
		} as unknown as TursoContext;

		mockFetch().mockResolvedValueOnce(sseResponse([]));

		await Changes.listen(dbCtx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
		});

		const [, opts] = mockFetch().mock.calls[0]!;
		expect((opts?.headers as Record<string, string>).Authorization).toBe(
			'Bearer stored-tenant-db-token',
		);
	});

	it('declares database_token in account fields for tenant-scoped credentials', () => {
		expect(turso().authConfig?.api_key?.account).toEqual(['database_token']);
	});

	it('falls back to the platform token when no database token is set', async () => {
		mockFetch().mockResolvedValueOnce(sseResponse([]));

		await Changes.listen(ctx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
		});

		const [, opts] = mockFetch().mock.calls[0]!;
		expect((opts?.headers as Record<string, string>).Authorization).toBe(
			`Bearer ${TEST_TOKEN}`,
		);
	});

	it('gives every received event its own identity', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const dbCtx = {
			key: TEST_TOKEN,
			options: {},
			db: { changeEvents: { upsertByEntityId } },
		} as unknown as TursoContext;

		// Three changes to the SAME row — keying by row id would collapse them.
		mockFetch().mockResolvedValueOnce(
			sseResponse([
				'data: {"id":42,"n":1}\n\ndata: {"id":42,"n":2}\n\ndata: {"id":42,"n":3}\n\n',
			]),
		);

		await Changes.listen(dbCtx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'update',
		});

		expect(upsertByEntityId).toHaveBeenCalledTimes(3);
		const ids = upsertByEntityId.mock.calls.map((c) => c[0]);
		expect(new Set(ids).size).toBe(3);
		// Each row is still persisted in full.
		expect(
			upsertByEntityId.mock.calls.map(
				(c) => (c[1] as { data: { n: number } }).data.n,
			),
		).toEqual([1, 2, 3]);
	});

	it('mirrors streamed events into the changeEvents entity', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const dbCtx = {
			key: TEST_TOKEN,
			options: {},
			db: { changeEvents: { upsertByEntityId } },
		} as unknown as TursoContext;

		mockFetch().mockResolvedValueOnce(sseResponse(['data: {"id":7}\n\n']));

		await Changes.listen(dbCtx, {
			databaseUrl: DB_URL,
			table: 'orders',
			action: 'insert',
		});

		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		const [entityId, row] = upsertByEntityId.mock.calls[0]!;
		// Identity is per received event, not derived from the row.
		expect(entityId).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
		);
		expect(row).toMatchObject({
			databaseUrl: DB_URL,
			table: 'orders',
			action: 'insert',
			data: { id: 7 },
		});
	});

	it('does not log event payloads, which can carry row data', async () => {
		mockFetch().mockResolvedValueOnce(
			sseResponse(['data: {"ssn":"secret-value"}\n\n']),
		);

		await Changes.listen(ctx, {
			databaseUrl: DB_URL,
			table: 'people',
			action: 'insert',
		});

		const meta = mockLog.mock.calls[0]![2] as Record<string, unknown>;
		expect(meta).toEqual({
			table: 'people',
			action: 'insert',
			mode: 'stream',
			eventCount: 1,
		});
		expect(JSON.stringify(meta)).not.toContain('secret-value');
	});
});
