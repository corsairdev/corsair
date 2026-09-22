import type {
	TursoContext,
	TursoKeyBuilderContext,
	TursoPluginOptions,
} from './index';

export const TEST_TOKEN = 'test-turso-token-123';
export const DB_URL = 'https://mydb-myorg.turso.io';

// Tests call endpoint handlers directly; sibling endpoints are unused.
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
export function createMockChangeEventsRepository(
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
export function createTestContext(
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
export function createKeyBuilderContext(
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
 * Builds a live-test context with real credentials from the environment.
 */
export function createLiveTestContext(
	key: string,
	options: TursoPluginOptions = { key },
): TursoContext {
	return createTestContext({
		key,
		options,
		keys: {
			get_api_key: async () => key,
			get_database_token: async () => options.databaseToken ?? null,
			get_webhook_signature: async () => null,
			set_api_key: async () => undefined,
			set_database_token: async () => undefined,
			set_webhook_signature: async () => undefined,
		},
	});
}

/**
 * Builds a Response whose body streams the given SSE chunks.
 */
export function sseResponse(chunks: string[]): Response {
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
 * Creates a mock JSON Response object.
 */
export function jsonResponse(payload: unknown, status: number = 200): Response {
	return {
		ok: status >= 200 && status < 300,
		status,
		headers: new Headers({ 'content-type': 'application/json' }),
		json: async (): Promise<unknown> => payload,
		text: async (): Promise<string> => JSON.stringify(payload),
	} as Response;
}
