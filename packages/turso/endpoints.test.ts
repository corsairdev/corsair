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
import type { ListenToChangesInput } from './endpoints/types';
import type {
	TursoContext,
	TursoKeyBuilderContext,
	TursoPluginOptions,
} from './index';
import { turso } from './index';

const TEST_TOKEN = 'test-turso-token-123';
const DB_URL = 'https://mydb-myorg.turso.io';

// Safe: the handlers under test never read ctx.endpoints.
// A narrower type is not practical because the real bound endpoint tree needs the full plugin runtime.
const testEndpoints = {} as TursoContext['endpoints'];

/**
 * Default key-manager doubles for Turso unit tests.
 */
function createDefaultKeys(
	overrides?: Partial<TursoContext['keys']>,
): TursoContext['keys'] {
	return {
		get_api_key: jest.fn().mockResolvedValue(TEST_TOKEN),
		get_database_token: jest.fn().mockResolvedValue(null),
		get_webhook_signature: jest.fn().mockResolvedValue(null),
		set_api_key: jest.fn().mockResolvedValue(undefined),
		set_database_token: jest.fn().mockResolvedValue(undefined),
		set_webhook_signature: jest.fn().mockResolvedValue(undefined),
		get_dek: jest.fn().mockResolvedValue('test-dek'),
		issue_new_dek: jest.fn().mockResolvedValue('new-dek'),
		...overrides,
	};
}

/**
 * Creates an explicitly typed mock repository for the `changeEvents` entity table.
 */
function createMockChangeEventsRepository(
	overrides?: Partial<TursoContext['db']['changeEvents']>,
): TursoContext['db']['changeEvents'] {
	return {
		findByEntityId: jest.fn().mockResolvedValue(null),
		existsByEntityId: jest.fn().mockResolvedValue(false),
		findIdByEntityId: jest.fn().mockResolvedValue(null),
		findById: jest.fn().mockResolvedValue(null),
		findManyByEntityIds: jest.fn().mockResolvedValue([]),
		list: jest.fn().mockResolvedValue([]),
		search: jest.fn().mockResolvedValue([]),
		upsertByEntityId: jest.fn().mockResolvedValue({
			id: 'mock-uuid-1',
			account_id: 'test-account',
			entity_type: 'changeEvents',
			entity_id: 'mock-event-1',
			version: '1.0.0',
			data: {
				databaseUrl: DB_URL,
				table: 'users',
				action: 'insert',
				receivedAt: '2026-09-14T00:00:00.000Z',
				data: null,
			},
			created_at: new Date(),
			updated_at: new Date(),
		}),
		deleteById: jest.fn().mockResolvedValue(true),
		deleteByEntityId: jest.fn().mockResolvedValue(true),
		count: jest.fn().mockResolvedValue(0),
		...overrides,
	};
}

/**
 * Builds a strongly typed `TursoContext` fixture for endpoint unit tests.
 */
function createTestContext(
	overrides: {
		key?: string;
		options?: TursoPluginOptions;
		keys?: Partial<TursoContext['keys']>;
		db?: Partial<TursoContext['db']>;
	} = {},
): TursoContext {
	const defaultChangeEvents = createMockChangeEventsRepository();
	return {
		key: overrides.key ?? TEST_TOKEN,
		options: overrides.options ?? {},
		keys: createDefaultKeys(overrides.keys),
		db: {
			changeEvents: overrides.db?.changeEvents ?? defaultChangeEvents,
		},
		$getAccountId: jest.fn().mockResolvedValue('test-account-id'),
		endpoints: testEndpoints,
	};
}

/**
 * Builds a `TursoKeyBuilderContext` for keyBuilder tests.
 */
function createKeyBuilderContext(
	apiKeyVal: string | null = TEST_TOKEN,
): TursoKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		tenantId: 'test-tenant',
		keys: createDefaultKeys({
			get_api_key: jest.fn().mockResolvedValue(apiKeyVal),
		}),
	};
}

/**
 * Builds a Response whose body streams the given SSE chunks.
 */
function sseResponse(chunks: string[]): Response {
	const encoder = new TextEncoder();
	let i = 0;
	const stream = new ReadableStream<Uint8Array>({
		pull(controller) {
			if (i < chunks.length) {
				controller.enqueue(encoder.encode(chunks[i]!));
				i += 1;
				return;
			}
			controller.close();
		},
	});
	return new Response(stream, {
		status: 200,
		headers: { 'content-type': 'text/event-stream' },
	});
}

/**
 * Builds a JSON Response with the given status.
 */
// Safe: the payload is only passed to JSON.stringify.
// A narrower type is not practical because tests feed arbitrary provider bodies, including malformed ones.
function jsonResponse(payload: unknown, status: number = 200): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'content-type': 'application/json' },
	});
}

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// Safe: the module is replaced by jest.mock above.
// A narrower type is not practical because jest.mock does not change the declared type of the import.
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx: TursoContext = createTestContext();

const originalFetch = global.fetch;

beforeEach(() => {
	mockLog.mockClear();
	global.fetch = jest.fn();
});

afterAll(() => {
	global.fetch = originalFetch;
});

const mockFetch = (): jest.MockedFunction<typeof fetch> =>
	// Safe: the beforeEach hook assigns jest.fn() to global.fetch.
	// A narrower type is not practical because global.fetch is declared with the plain fetch type.
	global.fetch as jest.MockedFunction<typeof fetch>;

type KeyBuilderFn = (
	ctx: TursoKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

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
		const pluginWithKey = turso({ key: TEST_TOKEN });
		// Safe: KeyBuilderFn matches the keyBuilder the plugin factory returns.
		// A narrower type is not practical because the plugin type erases the keyBuilder context parameter.
		const withKeyBuilder = pluginWithKey.keyBuilder as KeyBuilderFn;
		await expect(
			withKeyBuilder(createKeyBuilderContext(), 'endpoint'),
		).resolves.toBe(TEST_TOKEN);

		const plugin = turso();
		// Safe: KeyBuilderFn matches the keyBuilder the plugin factory returns.
		// A narrower type is not practical because the plugin type erases the keyBuilder context parameter.
		const keyBuilder = plugin.keyBuilder as KeyBuilderFn;
		await expect(
			keyBuilder(createKeyBuilderContext(TEST_TOKEN), 'endpoint'),
		).resolves.toBe(TEST_TOKEN);

		// A missing credential must raise, not resolve to an empty string.
		await expect(
			keyBuilder(createKeyBuilderContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);

		// KeyBuilder only supports endpoint calls, webhook source must reject.
		await expect(
			keyBuilder(createKeyBuilderContext(TEST_TOKEN), 'webhook'),
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
		expect(new Headers(calledOptions?.headers).get('authorization')).toBeNull();

		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'turso.regions.closest',
			{},
			'completed',
		);
	});

	it('surfaces 429 with the Retry-After delay', async () => {
		mockFetch().mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: { 'retry-after': '7' },
			}),
		);
		await expect(Regions.closest(ctx, {})).rejects.toMatchObject({
			status: 429,
			retryAfter: 7000,
		});
	});

	it('accepts a response without a client code', async () => {
		mockFetch().mockResolvedValueOnce(jsonResponse({ server: 'lhr' }));
		expect(await Regions.closest(ctx, {})).toEqual({ server: 'lhr' });
	});

	it('rejects a malformed region payload', async () => {
		mockFetch().mockResolvedValueOnce(jsonResponse({ client: 'lhr' }));
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
		expect(new Headers(calledOptions?.headers).get('authorization')).toBe(
			`Bearer ${TEST_TOKEN}`,
		);
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

		const meta = mockLog.mock.calls[0]![2];
		expect(meta).toEqual({ exp: -1 });
		expect(JSON.stringify(meta)).not.toContain(TEST_TOKEN);
	});

	it('throws AuthMissingError without calling fetch when no key is resolved', async () => {
		const empty = createTestContext({ key: '' });
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

	it('surfaces 429 with the Retry-After delay', async () => {
		mockFetch().mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: { 'retry-after': '7' },
			}),
		);
		await expect(Tokens.validate(ctx, {})).rejects.toMatchObject({
			status: 429,
			retryAfter: 7000,
		});
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

	it('keeps events received before the stream drops and persists them', async () => {
		const encoder = new TextEncoder();
		let sent = false;
		const stream = new ReadableStream<Uint8Array>({
			pull(controller) {
				if (!sent) {
					sent = true;
					controller.enqueue(encoder.encode('data: {"id":1}\n\n'));
					return;
				}
				controller.error(new Error('connection reset'));
			},
		});
		mockFetch().mockResolvedValueOnce(new Response(stream, { status: 200 }));
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		const dbCtx = createTestContext({
			db: {
				changeEvents: createMockChangeEventsRepository({ upsertByEntityId }),
			},
		});

		const result = await Changes.listen(dbCtx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
		});

		if (result.mode !== 'stream') throw new Error('expected stream');
		expect(result.events).toHaveLength(1);
		expect(result.stoppedBy).toBe('stream_closed');
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('bounds the fallback health check by timeoutMs', async () => {
		const spy = jest.spyOn(AbortSignal, 'timeout');
		mockFetch()
			.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 404))
			.mockResolvedValueOnce(jsonResponse({ results: [] }));
		await Changes.listen(ctx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
			timeoutMs: 2_000,
		});
		const [requested] = spy.mock.calls[0]!;
		expect(requested).toBeGreaterThan(0);
		expect(requested).toBeLessThanOrEqual(2_000);
		spy.mockRestore();
	});

	it('surfaces 401 as a TursoAPIError with status 401', async () => {
		mockFetch().mockResolvedValueOnce(
			jsonResponse({ error: 'unauthorized' }, 401),
		);
		await expect(
			Changes.listen(ctx, {
				databaseUrl: DB_URL,
				table: 'users',
				action: 'insert',
			}),
		).rejects.toMatchObject({
			status: 401,
			message: 'Turso listen request failed with status 401',
		});
	});

	it('surfaces 429 with the Retry-After delay', async () => {
		mockFetch().mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: { 'retry-after': '7' },
			}),
		);
		await expect(
			Changes.listen(ctx, {
				databaseUrl: DB_URL,
				table: 'users',
				action: 'insert',
			}),
		).rejects.toMatchObject({ status: 429, retryAfter: 7000 });
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
		const bad: Array<Record<string, string | number>> = [
			{ databaseUrl: DB_URL, table: '', action: 'insert' },
			{ databaseUrl: DB_URL, table: 'users', action: 'upsert' },
			{ databaseUrl: DB_URL, table: 'users', action: 'insert', maxEvents: 0 },
			{ databaseUrl: DB_URL, table: 'users', action: 'insert', timeoutMs: 100 },
		];
		for (const input of bad) {
			await expect(
				// Safe: the inputs are deliberately invalid and must be rejected at runtime.
				// A narrower type is not practical because a valid ListenToChangesInput would defeat the test.
				Changes.listen(ctx, input as ListenToChangesInput),
			).rejects.toThrow();
		}
		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError without calling fetch when no key is resolved', async () => {
		const empty = createTestContext({ key: '' });
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
		const dbCtx = createTestContext({
			options: { databaseToken: 'db-scoped-token' },
		});

		mockFetch().mockResolvedValueOnce(sseResponse([]));

		await Changes.listen(dbCtx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
		});

		const [, opts] = mockFetch().mock.calls[0]!;
		expect(new Headers(opts?.headers).get('authorization')).toBe(
			'Bearer db-scoped-token',
		);
	});

	it('uses a stored tenant-scoped database token when configured in key manager', async () => {
		const dbCtx = createTestContext({
			keys: {
				get_api_key: jest.fn().mockResolvedValue(TEST_TOKEN),
				get_database_token: jest
					.fn()
					.mockResolvedValue('stored-tenant-db-token'),
				set_api_key: jest.fn().mockResolvedValue(undefined),
				set_database_token: jest.fn().mockResolvedValue(undefined),
				get_webhook_signature: jest.fn().mockResolvedValue(null),
				set_webhook_signature: jest.fn().mockResolvedValue(undefined),
			},
		});

		mockFetch().mockResolvedValueOnce(sseResponse([]));

		await Changes.listen(dbCtx, {
			databaseUrl: DB_URL,
			table: 'users',
			action: 'insert',
		});

		const [, opts] = mockFetch().mock.calls[0]!;
		expect(new Headers(opts?.headers).get('authorization')).toBe(
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
		expect(new Headers(opts?.headers).get('authorization')).toBe(
			`Bearer ${TEST_TOKEN}`,
		);
	});

	it('gives every received event its own identity', async () => {
		const upsertByEntityId = jest
			.fn<
				ReturnType<TursoContext['db']['changeEvents']['upsertByEntityId']>,
				Parameters<TursoContext['db']['changeEvents']['upsertByEntityId']>
			>()
			.mockResolvedValue({
				id: 'mock-uuid-1',
				account_id: 'test-account',
				entity_type: 'changeEvents',
				entity_id: 'mock-event-1',
				version: '1.0.0',
				data: {
					databaseUrl: DB_URL,
					table: 'users',
					action: 'update',
					receivedAt: '2026-09-14T00:00:00.000Z',
					data: null,
				},
				created_at: new Date(),
				updated_at: new Date(),
			});
		const changeEventsRepo = createMockChangeEventsRepository({
			upsertByEntityId,
		});
		const dbCtx = createTestContext({
			db: { changeEvents: changeEventsRepo },
		});

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
		expect(upsertByEntityId.mock.calls.map((c) => c[1].data)).toEqual([
			{ id: 42, n: 1 },
			{ id: 42, n: 2 },
			{ id: 42, n: 3 },
		]);
	});

	it('mirrors streamed events into the changeEvents entity', async () => {
		const upsertByEntityId = jest
			.fn<
				ReturnType<TursoContext['db']['changeEvents']['upsertByEntityId']>,
				Parameters<TursoContext['db']['changeEvents']['upsertByEntityId']>
			>()
			.mockResolvedValue({
				id: 'mock-uuid-1',
				account_id: 'test-account',
				entity_type: 'changeEvents',
				entity_id: 'mock-event-1',
				version: '1.0.0',
				data: {
					databaseUrl: DB_URL,
					table: 'orders',
					action: 'insert',
					receivedAt: '2026-09-14T00:00:00.000Z',
					data: { id: 7 },
				},
				created_at: new Date(),
				updated_at: new Date(),
			});
		const changeEventsRepo = createMockChangeEventsRepository({
			upsertByEntityId,
		});
		const dbCtx = createTestContext({
			db: { changeEvents: changeEventsRepo },
		});

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

		const meta = mockLog.mock.calls[0]![2];
		expect(meta).toEqual({
			table: 'people',
			action: 'insert',
			mode: 'stream',
			eventCount: 1,
		});
		expect(JSON.stringify(meta)).not.toContain('secret-value');
	});
});
