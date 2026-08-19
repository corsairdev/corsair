/**
 * Registry invariants and error routing.
 *
 * The registry checks keep the four parallel structures - the nested endpoint
 * tree, the schema map, the metadata map and the documented contract - in step
 * with each other; drift between them is the failure mode that a plugin this
 * wide invites.
 *
 * The error checks matter more here than on most providers, because API Ninjas
 * answers almost everything with a 400 and expects the body to be read.
 */
import { ApiError } from 'corsair/http';
import { DOCUMENTED_OPERATIONS } from './docs-contract';
import {
	ApiNinjasEndpointInputSchemas,
	ApiNinjasEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { apiNinjasEndpointSchemas, apininjas } from './index';

const plugin = apininjas();

/**
 * The endpoint tree, read structurally. The declared type is a deep literal of
 * 129 typed callables, which is precise for callers and unusable for iteration.
 */
const endpointTree = plugin.endpoints as unknown as Record<
	string,
	Record<string, unknown>
>;

/** Flattens the nested endpoint tree into `group.leaf` paths. */
function nestedPaths(): string[] {
	const paths: string[] = [];
	for (const [group, leaves] of Object.entries(endpointTree)) {
		for (const leaf of Object.keys(leaves)) {
			paths.push(`${group}.${leaf}`);
		}
	}
	return paths.sort();
}

describe('registry', () => {
	it('registers all 129 catalog operations', () => {
		expect(nestedPaths()).toHaveLength(129);
	});

	it('keeps the endpoint tree, schemas and metadata in step', () => {
		const paths = nestedPaths();

		expect(Object.keys(apiNinjasEndpointSchemas).sort()).toEqual(paths);
		expect(
			Object.keys(plugin.endpointMeta as Record<string, unknown>).sort(),
		).toEqual(paths);
		expect(Object.keys(DOCUMENTED_OPERATIONS)).toHaveLength(paths.length);
	});

	it('names every operation key as its path camel-cased', () => {
		// The schema maps are keyed by `groupLeaf` while the registry is keyed by
		// `group.leaf`. A mismatch would make a lookup silently return undefined.
		for (const path of nestedPaths()) {
			const [group, leaf] = path.split('.');
			const key = `${group}${(leaf as string).charAt(0).toUpperCase()}${(leaf as string).slice(1)}`;

			expect(ApiNinjasEndpointInputSchemas).toHaveProperty(key);
			expect(ApiNinjasEndpointOutputSchemas).toHaveProperty(key);
			expect(DOCUMENTED_OPERATIONS[key]?.path).toBe(path);
		}
	});

	it('points every operation at a documented endpoint and version', () => {
		for (const [key, documented] of Object.entries(DOCUMENTED_OPERATIONS)) {
			expect({ key, version: documented.version }).toEqual({
				key,
				version: expect.stringMatching(/^v[123]$/),
			});
			expect(documented.endpoint).toMatch(/^[a-z0-9]+$/);
			expect(['GET', 'POST']).toContain(documented.method);
		}
	});

	it('exposes every endpoint as a callable', () => {
		for (const leaves of Object.values(endpointTree)) {
			for (const endpoint of Object.values(leaves)) {
				expect(typeof endpoint).toBe('function');
			}
		}
	});
});

describe('risk levels', () => {
	const meta = plugin.endpointMeta as Record<
		string,
		{ riskLevel: string; description: string }
	>;

	it('marks the counter as the only operation that changes anything', () => {
		// Everything else on this API is a pure lookup. The counter endpoint
		// increments a stored value when called with `hit` or `value`.
		//
		// This doubles as the retry-safety check. Corsair replays the whole
		// endpoint call when a handler asks for a retry and this API offers no
		// idempotency key, so the set of operations that must not be replayed is
		// exactly the set that is not a read - and it is derived here rather than
		// matched by name, so a new write cannot join it silently.
		const writes = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel !== 'read')
			.map(([path]) => path);

		expect(writes).toEqual(['utility.counter']);
		expect(meta['utility.counter']?.riskLevel).toBe('write');
	});

	it('has no destructive operation, because the API deletes nothing', () => {
		const destructive = Object.values(meta).filter(
			(entry) => entry.riskLevel === 'destructive',
		);

		expect(destructive).toHaveLength(0);
	});

	it('describes every operation in plain ASCII', () => {
		for (const [path, entry] of Object.entries(meta)) {
			expect({ path, empty: entry.description.trim().length === 0 }).toEqual({
				path,
				empty: false,
			});
			// Printable ASCII only: these descriptions are rendered in the operation
			// catalog and quoted in the pull request, and a stray byte from a
			// scraped description would surface there as mojibake.
			expect(entry.description).toMatch(/^[ -~]+$/);
		}
	});

	it('flags the premium-gated and deprecated operations in their description', () => {
		expect(meta['markets.earningsTranscript']?.description).toContain(
			'premium plan required',
		);
		expect(meta['transport.cars']?.description).toContain('deprecated');
	});
});

/** Builds an ApiError the way the transport does, with a status and a body. */
function apiError(status: number, body: unknown, message = 'Error'): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.api-ninjas.com/v1/sentiment' },
		{
			url: 'https://api.api-ninjas.com/v1/sentiment',
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		message,
	);
}

type ErrorContext = {
	pluginId: string;
	operation: string;
	input: Record<string, unknown>;
	originalError: Error;
};

const context: ErrorContext = {
	pluginId: 'apininjas',
	operation: 'text.sentiment',
	input: {},
	originalError: new Error('test'),
};

type Matcher = { match: (error: Error, context: ErrorContext) => boolean };

/** The first handler that matches, in declaration order - as the core does it. */
function route(error: Error): string {
	for (const [name, handler] of Object.entries(
		errorHandlers as Record<string, Matcher>,
	)) {
		if (handler.match(error, context)) return name;
	}
	return 'NONE';
}

describe('error routing', () => {
	beforeEach(() => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each([
		[
			'an exhausted monthly quota',
			apiError(400, { error: 'Monthly quota exceeded. Consider upgrading.' }),
			'RATE_LIMIT_ERROR',
		],
		[
			'a throttled request',
			apiError(429, { error: 'Too Many Requests' }),
			'RATE_LIMIT_ERROR',
		],
		[
			'a missing key',
			apiError(400, { error: 'Missing API Key.' }),
			'AUTH_ERROR',
		],
		[
			'an invalid key',
			apiError(400, { error: 'Invalid API Key.' }),
			'AUTH_ERROR',
		],
		[
			'a premium-only endpoint',
			apiError(400, {
				error: 'This endpoint is available to premium subscribers only.',
			}),
			'PERMISSION_ERROR',
		],
		[
			'a premium-only parameter',
			apiError(400, {
				error: 'year parameter is for premium subscribers only',
			}),
			'PERMISSION_ERROR',
		],
		[
			'an endpoint disabled for free users',
			apiError(400, {
				error: 'This endpoint is currently down for free users.',
			}),
			'PERMISSION_ERROR',
		],
		[
			'an unknown endpoint',
			apiError(404, {
				message:
					'Endpoint not found. Please check your spelling and try again.',
			}),
			'NOT_FOUND_ERROR',
		],
		[
			'an ordinary bad parameter',
			apiError(400, { error: 'Invalid text parameter.' }),
			'BAD_REQUEST_ERROR',
		],
		[
			'a server fault',
			apiError(502, { message: 'Internal server error' }),
			'SERVER_ERROR',
		],
		['a dropped connection', new Error('fetch failed'), 'NETWORK_ERROR'],
	])('routes %s to %s', (_label, error, expected) => {
		expect(route(error as Error)).toBe(expected);
	});

	it('never retries an exhausted quota', async () => {
		// The monthly allowance does not return inside a retry window, so retrying
		// only spends attempts against a limit that is already gone.
		const error = apiError(400, { error: 'Monthly quota exceeded.' });

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			context,
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a genuine 429', async () => {
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError(429, { error: 'Too Many Requests' }),
			context,
		);

		expect(strategy.maxRetries).toBe(5);
	});

	it('does not retry a 502, which is also how a bad parameter is reported', async () => {
		// A wrong parameter name and an unsolvable puzzle both come back as 502
		// here, and retrying either five times just spends quota.
		const strategy = await errorHandlers.SERVER_ERROR.handler(
			apiError(502, { message: 'Internal server error' }),
			context,
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a real server fault', async () => {
		const strategy = await errorHandlers.SERVER_ERROR.handler(
			apiError(503, { message: 'Service Unavailable' }),
			context,
		);

		expect(strategy.maxRetries).toBe(2);
	});

	it('keeps DEFAULT last so the specific handlers stay reachable', () => {
		const names = Object.keys(errorHandlers);

		expect(names[names.length - 1]).toBe('DEFAULT');
	});
});

describe('plugin definition', () => {
	it('declares a single API key and no webhooks', () => {
		expect(plugin.id).toBe('apininjas');
		expect(plugin.authConfig).toEqual({ api_key: { account: ['one'] } });
		// API Ninjas is request/response only - nothing calls back.
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('uses the key given in options ahead of the stored credential', async () => {
		const configured = apininjas({ key: 'option-key' });
		const keyBuilder = configured.keyBuilder as (
			ctx: unknown,
			source: string,
		) => Promise<string>;

		await expect(
			keyBuilder({ authType: 'api_key', keys: {} }, 'endpoint'),
		).resolves.toBe('option-key');
	});

	it('raises rather than sending an empty key', async () => {
		const keyBuilder = plugin.keyBuilder as (
			ctx: unknown,
			source: string,
		) => Promise<string>;

		// An empty key reaches the provider as "Missing API Key." - a confusing
		// way to report a configuration gap.
		await expect(
			keyBuilder(
				{ authType: 'api_key', keys: { get_api_key: async () => undefined } },
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('returns the stored credential when there is one', async () => {
		const keyBuilder = plugin.keyBuilder as (
			ctx: unknown,
			source: string,
		) => Promise<string>;

		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				},
				'endpoint',
			),
		).resolves.toBe('stored-key');
	});

	it('raises for any source other than an endpoint call', async () => {
		// There is no webhook or OAuth path on this plugin, so a request for a key
		// from anywhere else is a bug rather than a case to serve.
		const keyBuilder = plugin.keyBuilder as (
			ctx: unknown,
			source: string,
		) => Promise<string>;

		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				},
				'webhook',
			),
		).rejects.toThrow();
	});

	it('merges caller-supplied error handlers ahead of the built-in default', () => {
		// DEFAULT matches everything, so a caller handler spread after it would be
		// unreachable. The merge keeps DEFAULT last.
		const custom = apininjas({
			errorHandlers: {
				RATE_LIMIT_ERROR: { match: () => false, handler: async () => ({}) },
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(
			custom.errorHandlers?.RATE_LIMIT_ERROR?.match(new Error('x'), {
				pluginId: 'apininjas',
				operation: 'text.sentiment',
				input: {},
				originalError: new Error('x'),
			}),
		).toBe(false);
	});

	it('lets a caller replace the default handler itself', () => {
		const replacement = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const custom = apininjas({ errorHandlers: { DEFAULT: replacement } });

		expect(custom.errorHandlers?.DEFAULT).toBe(replacement);
		expect(Object.keys(custom.errorHandlers ?? {}).pop()).toBe('DEFAULT');
	});
});
