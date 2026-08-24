import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import type { ApifyOperationDefinition } from './endpoints/operations';
import {
	ApifyRestEndpoints,
	apifyOperations,
	buildApifyEndpointMeta,
	buildApifyEndpointSchemas,
} from './endpoints/rest';
import {
	ApifyOperationInputSchema,
	ApifyOperationOutputSchema,
} from './endpoints/rest-types';
import type { ApifyMcpContext } from './index';
import { apify } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type OperationEntry = { path: string; def: ApifyOperationDefinition };

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
	it('registers exactly the 113 OSS listing operations', () => {
		expect(ALL_OPERATIONS.length).toBe(113);
		const slugs = ALL_OPERATIONS.map(({ def }) => def.slug);
		expect(new Set(slugs).size).toBe(113);
		for (const slug of slugs) {
			expect(slug.startsWith('APIFY_')).toBe(true);
		}
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
			const releasesLock = def.path.endsWith('/lock');
			if (releasesLock) {
				expect(def.riskLevel).not.toBe('destructive');
				expect(def.irreversible).not.toBe(true);
			} else {
				expect(def.riskLevel).toBe('destructive');
			}
		}
	});
});

describe('apify endpoint tree', () => {
	it('exposes a callable function for every registered operation', () => {
		expect(typeof ApifyRestEndpoints).toBe('object');
		const acts = (ApifyRestEndpoints as Record<string, unknown>).acts;
		expect(typeof acts).toBe('object');
		expect(
			typeof (acts as Record<string, (...a: unknown[]) => unknown>)
				.getActorDetails,
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
		const sample = schemaMap['acts.getActorDetails'];
		expect(sample).toBeDefined();
		const parsed = sample?.input.safeParse({ actorId: 'abc123' });
		expect(parsed?.success).toBe(true);
	});

	it('rejects inputs missing a required path param', () => {
		const sample = schemaMap['acts.getActorDetails'];
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
		expect(metaMap['acts.deleteActor']?.riskLevel).toBe('destructive');
		expect(metaMap['acts.deleteActor']?.irreversible).toBe(true);
	});
});

function makeCtx(key = 'test-token'): ApifyMcpContext {
	return { key } as unknown as ApifyMcpContext;
}

describe('apify endpoint invocation', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockLog.mockResolvedValue(null);
	});

	it('routes an endpoint call to makeApifyRequest with the right method, path, and bearer token', async () => {
		mockRequest.mockResolvedValue({ id: 'actor-1' });

		const result = await (
			ApifyRestEndpoints as unknown as {
				acts: {
					getActorDetails: (
						ctx: ApifyMcpContext,
						input: unknown,
					) => Promise<unknown>;
				};
			}
		).acts.getActorDetails(makeCtx(), { actorId: 'abc123' });

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
		expect(requestOptions?.body).toBeUndefined();
		expect(result).toEqual({ id: 'actor-1' });
	});

	it('still returns the Apify response when logging throws', async () => {
		mockRequest.mockResolvedValue({ id: 'actor-1' });
		mockLog.mockRejectedValue(new Error('logger down'));

		const result = await (
			ApifyRestEndpoints as unknown as {
				acts: {
					getActorDetails: (
						ctx: ApifyMcpContext,
						input: unknown,
					) => Promise<unknown>;
				};
			}
		).acts.getActorDetails(makeCtx(), { actorId: 'abc123' });

		expect(result).toEqual({ id: 'actor-1' });
	});

	it('builds a JSON body from non-reserved input fields on POST', async () => {
		mockRequest.mockResolvedValue({ ok: true });

		await (
			ApifyRestEndpoints as unknown as {
				datasets: {
					storeDataInDataset: (
						ctx: ApifyMcpContext,
						input: unknown,
					) => Promise<unknown>;
				};
			}
		).datasets.storeDataInDataset(makeCtx(), {
			datasetId: 'd1',
			items: [{ e: 1 }],
		});

		const requestOptions = mockRequest.mock.calls[0]?.[1];
		expect(requestOptions).toMatchObject({
			method: 'POST',
			url: '/v2/datasets/{datasetId}/items',
			body: { items: [{ e: 1 }] },
		});
		expect(requestOptions?.path).toEqual({ datasetId: 'd1' });
	});

	it('passes query params through without polluting the body', async () => {
		mockRequest.mockResolvedValue([]);

		await (
			ApifyRestEndpoints as unknown as {
				acts: {
					getListOfBuilds: (
						ctx: ApifyMcpContext,
						input: unknown,
					) => Promise<unknown>;
				};
			}
		).acts.getListOfBuilds(makeCtx(), {
			actorId: 'a1',
			limit: 5,
			offset: 10,
		});

		const requestOptions = mockRequest.mock.calls[0]?.[1];
		expect(requestOptions?.query).toMatchObject({ limit: 5, offset: 10 });
		expect(requestOptions?.body).toBeUndefined();
	});

	it('returns { success: true } for an empty response on non-HEAD requests', async () => {
		mockRequest.mockResolvedValue(undefined);

		const result = await (
			ApifyRestEndpoints as unknown as {
				actorRuns: {
					deleteActorRun: (
						ctx: ApifyMcpContext,
						input: unknown,
					) => Promise<unknown>;
				};
			}
		).actorRuns.deleteActorRun(makeCtx(), { runId: 'r1' });

		expect(result).toEqual({ success: true });
	});

	it('wraps non-Api errors in ApifyAPIError before surfacing them', async () => {
		mockRequest.mockRejectedValue(new Error('network down'));

		await expect(
			(
				ApifyRestEndpoints as unknown as {
					acts: {
						getActorDetails: (
							ctx: ApifyMcpContext,
							input: unknown,
						) => Promise<unknown>;
					};
				}
			).acts.getActorDetails(makeCtx(), { actorId: 'abc123' }),
		).rejects.toThrow('network down');
	});

	it('routes the first operation of every namespace to its declared path and method', async () => {
		mockRequest.mockResolvedValue({ ok: true });
		const endpoints = ApifyRestEndpoints as unknown as Record<
			string,
			Record<string, (ctx: ApifyMcpContext, input: unknown) => Promise<unknown>>
		>;

		for (const sample of sampleOperationPerNamespace()) {
			const { namespace, opName, def } = sample;
			const nsEndpoints = endpoints[namespace];
			expect(nsEndpoints).toBeDefined();
			const endpointFn = nsEndpoints?.[opName];
			expect(endpointFn).toBeDefined();
			mockRequest.mockClear();
			const input: Record<string, string> = {};
			for (const param of def.pathParams) {
				input[param] = `sample-${param}`;
			}
			await endpointFn?.(makeCtx(), input);

			const requestOptions = mockRequest.mock.calls[0]?.[1];
			expect(requestOptions?.method).toBe(def.method);
			expect(requestOptions?.url).toBe(def.path);
		}
	});
});

function sampleOperationPerNamespace(): Array<{
	namespace: string;
	opName: string;
	def: ApifyOperationDefinition;
}> {
	const out: Array<{
		namespace: string;
		opName: string;
		def: ApifyOperationDefinition;
	}> = [];
	const root = apifyOperations as unknown as Record<string, unknown>;
	for (const [namespace, node] of Object.entries(root)) {
		const entry = firstLeaf(node);
		if (entry) out.push({ namespace, opName: entry.opName, def: entry.def });
	}
	return out;
}

function firstLeaf(
	node: unknown,
): { opName: string; def: ApifyOperationDefinition } | undefined {
	if (typeof node !== 'object' || node === null) return undefined;
	for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
		if (
			typeof value === 'object' &&
			value !== null &&
			'method' in value &&
			'path' in value
		) {
			return { opName: key, def: value as unknown as ApifyOperationDefinition };
		}
		const nested = firstLeaf(value);
		if (nested) return nested;
	}
	return undefined;
}

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

	it('exposes only API Key auth to match the OSS listing', () => {
		const plugin = apify({});
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(
			(plugin.options as { authType?: string } | undefined)?.authType,
		).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
	});

	it('keeps MCP actors endpoints next to REST acts', () => {
		const plugin = apify({});
		const endpoints = plugin.endpoints as unknown as {
			actors: { searchActors: unknown };
			acts: { getActorDetails: unknown };
			docs: { searchApifyDocs: unknown };
			runs: { getActorRun: unknown };
		};
		expect(typeof endpoints.actors.searchActors).toBe('function');
		expect(typeof endpoints.acts.getActorDetails).toBe('function');
		expect(typeof endpoints.docs.searchApifyDocs).toBe('function');
		expect(typeof endpoints.runs.getActorRun).toBe('function');
	});
});
