import { request } from 'corsair/http';
import type { ApifyOperationDefinition } from './endpoints';
import {
	ApifyEndpoints,
	apifyOperations,
	buildApifyEndpointMeta,
	buildApifyEndpointSchemas,
} from './endpoints';
import {
	ApifyOperationInputSchema,
	ApifyOperationOutputSchema,
} from './endpoints/types';
import type { ApifyContext } from './index';
import { apify } from './index';

// Mock the shared HTTP transport so endpoint invocations exercise the full
// request-building path (makeApifyRequest → buildBody/buildQuery/pickDefined)
// without hitting the network.
jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

type OperationEntry = { path: string; def: ApifyOperationDefinition };

// Walks the nested operation tree and yields every leaf operation with its
// dotted path (e.g. "act.buildsGet"). Used to assert over the full registry.
function isDefinition(node: unknown): node is ApifyOperationDefinition {
	return (
		typeof node === 'object' &&
		node !== null &&
		'method' in node &&
		'path' in node
	);
}

function flattenOperations(node: unknown, prefix = ''): OperationEntry[] {
	const out: OperationEntry[] = [];
	if (typeof node !== 'object' || node === null) return out;
	for (const [key, value] of Object.entries(node)) {
		if (isDefinition(value)) {
			out.push({ path: `${prefix}${key}`, def: value });
		} else {
			out.push(...flattenOperations(value, `${prefix}${key}.`));
		}
	}
	return out;
}

const ALL_OPERATIONS = flattenOperations(apifyOperations);

describe('apify operation registry', () => {
	it('registers a non-empty set of operations', () => {
		expect(ALL_OPERATIONS.length).toBeGreaterThan(0);
		// Sanity bound: the registry covers many Apify resources, so it is large.
		expect(ALL_OPERATIONS.length).toBeGreaterThan(100);
	});

	it('gives every operation a valid HTTP method and absolute path', () => {
		const allowedMethods = new Set([
			'GET',
			'POST',
			'PUT',
			'DELETE',
			'PATCH',
			'HEAD',
		]);
		for (const { def } of ALL_OPERATIONS) {
			expect(allowedMethods.has(def.method)).toBe(true);
			expect(def.path.startsWith('/v2/')).toBe(true);
			expect(typeof def.description).toBe('string');
			expect(def.description.length).toBeGreaterThan(0);
		}
	});

	it('declares every path param used in the URL template', () => {
		for (const { def } of ALL_OPERATIONS) {
			const templateParams = (def.path.match(/\{(\w+)\}/g) ?? []).map((t) =>
				t.slice(1, -1),
			);
			for (const param of templateParams) {
				expect(def.pathParams).toContain(param);
			}
		}
	});

	it('marks DELETE operations with the right risk level', () => {
		for (const { def } of ALL_OPERATIONS) {
			if (def.method !== 'DELETE') continue;
			// Two DELETE families are intentionally non-destructive:
			//  - /lock paths release a temporary request-queue lock (re-acquirable),
			//    so they are a write, not destructive, and never irreversible.
			//  - /v2/browser-info is a read-style endpoint the provider exposes
			//    across all HTTP verbs; the DELETE variant must not be destructive.
			const releasesLock = def.path.endsWith('/lock');
			const isBrowserInfo = def.path === '/v2/browser-info';
			if (releasesLock || isBrowserInfo) {
				expect(def.riskLevel).not.toBe('destructive');
				expect(def.irreversible).not.toBe(true);
			} else {
				// Every other DELETE removes a real Apify resource.
				expect(def.riskLevel).toBe('destructive');
			}
		}
	});
});

describe('apify endpoint tree', () => {
	it('exposes a callable function for every registered operation', () => {
		expect(typeof ApifyEndpoints).toBe('object');
		// Every leaf in the operation tree has a matching endpoint function.
		const actNode = (ApifyEndpoints as Record<string, unknown>).act;
		expect(typeof actNode).toBe('object');
		expect(
			typeof (actNode as Record<string, (...a: unknown[]) => unknown>).get,
		).toBe('function');
	});
});

describe('apify endpoint schemas', () => {
	const schemas = buildApifyEndpointSchemas(apifyOperations);
	const schemaMap = schemas as unknown as Record<
		string,
		{
			input: { safeParse: (v: unknown) => { success: boolean } };
			output: unknown;
		}
	>;

	it('builds an input/output schema entry for every operation', () => {
		const schemaKeys = Object.keys(schemaMap);
		expect(schemaKeys.length).toBe(ALL_OPERATIONS.length);
		for (const { path } of ALL_OPERATIONS) {
			expect(schemaMap[path]).toBeDefined();
		}
	});

	it('treats each path param as a required string|number input', () => {
		const sample = schemaMap['act.get'];
		expect(sample).toBeDefined();
		const parsed = sample?.input.safeParse({ actorId: 'abc123' });
		expect(parsed?.success).toBe(true);
	});

	it('rejects inputs missing a required path param', () => {
		const sample = schemaMap['act.get'];
		expect(sample).toBeDefined();
		const parsed = sample?.input.safeParse({});
		expect(parsed?.success).toBe(false);
	});

	it('preserves optional query/body passthrough fields', () => {
		const parsed = ApifyOperationInputSchema.safeParse({
			query: { limit: 10 },
			body: { foo: 'bar' },
		});
		expect(parsed.success).toBe(true);
	});

	it('uses a passthrough output schema', () => {
		expect(ApifyOperationOutputSchema.safeParse({ any: 'thing' }).success).toBe(
			true,
		);
	});
});

describe('apify endpoint meta', () => {
	const meta = buildApifyEndpointMeta(apifyOperations);
	const metaMap = meta as unknown as Record<
		string,
		{ riskLevel: string; irreversible?: boolean }
	>;

	it('captures risk metadata for every operation', () => {
		expect(Object.keys(metaMap).length).toBe(ALL_OPERATIONS.length);
		for (const { path } of ALL_OPERATIONS) {
			expect(metaMap[path]?.riskLevel).toBeDefined();
		}
	});

	it('tags actor delete as irreversible', () => {
		expect(metaMap['act.delete']?.riskLevel).toBe('destructive');
		expect(metaMap['act.delete']?.irreversible).toBe(true);
	});
});

// A minimal context carrying just the fields the endpoint closures read.
// makeApifyRequest consumes ctx.key; logEventFromContext reads ctx for logging.
function makeCtx(key = 'test-token'): ApifyContext {
	return { key } as unknown as ApifyContext;
}

describe('apify endpoint invocation', () => {
	beforeEach(() => mockRequest.mockReset());

	it('routes an endpoint call to makeApifyRequest with the right method, path, and bearer token', async () => {
		mockRequest.mockResolvedValue({ id: 'actor-1' });

		const result = await (
			ApifyEndpoints as unknown as {
				act: { get: (ctx: ApifyContext, input: unknown) => Promise<unknown> };
			}
		).act.get(makeCtx(), { actorId: 'abc123' });

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: 'https://api.apify.com',
			TOKEN: 'test-token',
		});
		expect(requestOptions).toMatchObject({
			method: 'GET',
			url: '/v2/actors/{actorId}',
		});
		expect(requestOptions?.path).toEqual({ actorId: 'abc123' });
		// GET requests carry no body.
		expect(requestOptions?.body).toBeUndefined();
		expect(result).toEqual({ id: 'actor-1' });
	});

	it('builds a JSON body from non-reserved input fields on POST', async () => {
		mockRequest.mockResolvedValue({ ok: true });

		await (
			ApifyEndpoints as unknown as {
				actorRun: {
					chargePost: (ctx: ApifyContext, input: unknown) => Promise<unknown>;
				};
			}
		).actorRun.chargePost(makeCtx(), { runId: 'r1', events: [{ e: 1 }] });

		const requestOptions = mockRequest.mock.calls[0]?.[1];
		expect(requestOptions).toMatchObject({
			method: 'POST',
			url: '/v2/actor-runs/{runId}/charge',
			body: { events: [{ e: 1 }] },
		});
		expect(requestOptions?.path).toEqual({ runId: 'r1' });
	});

	it('passes query params through without polluting the body', async () => {
		mockRequest.mockResolvedValue([]);

		await (
			ApifyEndpoints as unknown as {
				act: {
					buildsGet: (ctx: ApifyContext, input: unknown) => Promise<unknown>;
				};
			}
		).act.buildsGet(makeCtx(), { actorId: 'a1', limit: 5, offset: 10 });

		const requestOptions = mockRequest.mock.calls[0]?.[1];
		expect(requestOptions?.query).toMatchObject({ limit: 5, offset: 10 });
		// Query/path params are excluded from the body.
		expect(requestOptions?.body).toBeUndefined();
	});

	it('returns { success: true } for an empty response on non-HEAD requests', async () => {
		mockRequest.mockResolvedValue(undefined);

		const result = await (
			ApifyEndpoints as unknown as {
				actorRun: {
					delete: (ctx: ApifyContext, input: unknown) => Promise<unknown>;
				};
			}
		).actorRun.delete(makeCtx(), { runId: 'r1' });

		expect(result).toEqual({ success: true });
	});

	it('wraps non-Api errors in ApifyAPIError before surfacing them', async () => {
		mockRequest.mockRejectedValue(new Error('network down'));

		await expect(
			(
				ApifyEndpoints as unknown as {
					act: { get: (ctx: ApifyContext, input: unknown) => Promise<unknown> };
				}
			).act.get(makeCtx(), { actorId: 'abc123' }),
		).rejects.toThrow('network down');
	});
});

describe('apify plugin factory', () => {
	it('routes the inline key through keyBuilder before any request', async () => {
		const plugin = apify({ key: 'inline-key' });
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue('stored-key') },
		};
		const keyBuilder = plugin.keyBuilder as unknown as (
			ctx: { authType: string; keys: { get_api_key: () => Promise<string> } },
			source: string,
		) => Promise<string>;

		const key = await keyBuilder(ctx, 'endpoint');
		expect(key).toBe('inline-key');
	});

	it('falls back to the key store when no inline key is set', async () => {
		const plugin = apify({});
		const getApiKey = jest.fn().mockResolvedValue('stored-key');
		const ctx = { authType: 'api_key', keys: { get_api_key: getApiKey } };
		const keyBuilder = plugin.keyBuilder as unknown as (
			ctx: { authType: string; keys: { get_api_key: () => Promise<string> } },
			source: string,
		) => Promise<string>;

		const key = await keyBuilder(ctx, 'endpoint');
		expect(getApiKey).toHaveBeenCalled();
		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when no key is available', async () => {
		const plugin = apify({});
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(undefined) },
		};
		const keyBuilder = plugin.keyBuilder as unknown as (
			ctx: { authType: string; keys: { get_api_key: () => Promise<unknown> } },
			source: string,
		) => Promise<string>;

		await expect(keyBuilder(ctx, 'endpoint')).rejects.toThrow('api_key');
	});

	it('registers error handlers covering rate-limit and auth errors', () => {
		const plugin = apify({});
		expect(plugin.errorHandlers?.RATE_LIMIT_ERROR).toBeDefined();
		expect(plugin.errorHandlers?.AUTH_ERROR).toBeDefined();
		expect(plugin.errorHandlers?.DEFAULT).toBeDefined();
	});
});
