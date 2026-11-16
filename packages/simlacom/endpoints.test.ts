import { makeSimlaComRequest } from './client';
import { SIMLACOM_OPERATION_IDS } from './endpoints/operation-io-types';
import { createSimlaComOperationEndpoint } from './endpoints/shared';
import { getSimlaComOperation, SIMLACOM_OPERATIONS } from './endpoints/types';
import type { SimlaComContext, SimlaComPluginOptions } from './index';
import { simlacom } from './index';

function sampleValue(schema: {
	type?: string | readonly string[];
	enum?: readonly unknown[];
	minimum?: number;
}): unknown {
	// `unknown` is used because OpenAPI parameter schemas allow several JSON types.
	if (schema.enum && schema.enum.length > 0) return schema.enum[0];
	const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
	if (type === 'integer' || type === 'number') return schema.minimum ?? 1;
	if (type === 'boolean') return false;
	if (type === 'array') return [17];
	return 'fixture';
}

function samplePathValue(schema: {
	type?: string | readonly string[];
}): string | number {
	const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
	return type === 'integer' || type === 'number' ? 17 : 'fixture';
}

describe('documented operation transport', () => {
	afterEach(() => jest.restoreAllMocks());

	it('rejects undocumented input for every operation before network I/O', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		const context: SimlaComContext = {
			endpoints: {},
			db: {},
			$getAccountId: async () => 'test-account',
			key: 'unit-test-key',
			options: { subdomain: 'demo' },
			keys: {
				get_dek: async () => 'test-dek',
				issue_new_dek: async () => 'test-dek',
				get_api_key: async () => 'unit-test-key',
				set_api_key: async () => undefined,
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => undefined,
			},
		};
		const invalidInput = { path: { undocumented: true } };

		for (const id of SIMLACOM_OPERATION_IDS) {
			await expect(
				createSimlaComOperationEndpoint(id)(context, invalidInput),
			).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('covers every current API v5 method and the two account/version discovery methods', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async (input) => {
				const url = String(input);
				if (url.includes('/download') || url.includes('/record')) {
					return new Response(new Uint8Array([0x41]), {
						headers: { 'content-type': 'application/octet-stream' },
					});
				}
				return new Response(JSON.stringify({ success: true }), {
					headers: { 'content-type': 'application/json' },
				});
			});

		expect(SIMLACOM_OPERATIONS).toHaveLength(229);
		for (const operation of SIMLACOM_OPERATIONS) {
			const path: Record<string, string | number> = {};
			// Query value types vary by OpenAPI parameter and are narrowed by its generated schema.
			const query: Record<string, unknown> = {};
			for (const parameter of operation.parameters) {
				if (parameter.in === 'path') {
					path[parameter.name] = samplePathValue(parameter.schema);
				} else if (parameter.required && parameter.default === undefined) {
					query[parameter.name] = sampleValue(parameter.schema);
				}
			}
			const input = {
				...(Object.keys(path).length === 0 ? {} : { path }),
				...(Object.keys(query).length === 0 ? {} : { query }),
				...(operation.request
					? {
							body:
								operation.request.mediaType === 'application/octet-stream'
									? 'QQ=='
									: { sample: 'fixture' },
						}
					: {}),
			};
			await makeSimlaComRequest(operation, 'unit-test-key', 'demo', input);
		}

		expect(fetchMock).toHaveBeenCalledTimes(SIMLACOM_OPERATIONS.length);
		for (const [index, operation] of SIMLACOM_OPERATIONS.entries()) {
			const call = fetchMock.mock.calls[index];
			expect(call).toBeDefined();
			if (!call) continue;
			const requestUrl = new URL(String(call[0]));
			const route = operation.route.replace(
				/\{([^}]+)\}/g,
				(_match, name: string) => {
					const parameter = operation.parameters.find(
						(candidate) => candidate.in === 'path' && candidate.name === name,
					);
					return encodeURIComponent(
						String(parameter ? samplePathValue(parameter.schema) : 'fixture'),
					);
				},
			);
			const expectedPath = `${operation.versioned ? '/api/v5/' : '/'}${route}`;
			expect(requestUrl.pathname).toBe(expectedPath);
			expect(requestUrl.origin).toBe('https://demo.simla.com');
			expect(call[1]?.method).toBe(operation.method);
			expect(new Headers(call[1]?.headers).get('X-API-KEY')).toBe(
				'unit-test-key',
			);
			for (const parameter of operation.parameters) {
				if (
					parameter.in === 'query' &&
					parameter.required &&
					parameter.default === undefined
				) {
					expect(requestUrl.searchParams.has(parameter.name)).toBe(true);
				}
			}
			if (
				operation.request?.mediaType === 'application/x-www-form-urlencoded'
			) {
				expect(
					new Headers(call[1]?.headers)
						.get('Content-Type')
						?.startsWith('application/x-www-form-urlencoded'),
				).toBe(true);
				expect(new URLSearchParams(String(call[1]?.body)).get('sample')).toBe(
					'fixture',
				);
			}
			if (operation.request?.mediaType === 'application/octet-stream') {
				expect(new Headers(call[1]?.headers).get('Content-Type')).toBe(
					'application/octet-stream',
				);
				expect(call[1]?.body).toBeInstanceOf(Uint8Array);
			}
		}
	});

	it('forwards page, limit, and repeated bracket-filter values in GET queries', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ success: true, costs: [] }), {
				headers: { 'content-type': 'application/json' },
			}),
		);
		const operation = getSimlaComOperation('cost.list.get');

		await makeSimlaComRequest(operation, 'unit-test-key', 'demo', {
			query: { page: 2, limit: 50, 'filter[ids][]': [3, 5] },
		});

		const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.get('limit')).toBe('50');
		expect(url.searchParams.getAll('filter[ids][]')).toEqual(['3', '5']);
	});

	it('uses the exact v5 route and validates the operation registry lookup', () => {
		const operation = getSimlaComOperation('orders.list.get');
		expect(operation.route).toBe('orders');
		expect(operation.versioned).toBe(true);
		expect(() => getSimlaComOperation('orders.not-a-route.get')).toThrow(
			'Unknown Simla.com operation',
		);
	});

	it('forwards caller endpoint hooks through the plugin factory', () => {
		const hooks: SimlaComPluginOptions['hooks'] = {
			api: {
				apiVersions: {
					get: {
						before: async (ctx, args) => ({ ctx, args }),
					},
				},
			},
		};
		const plugin = simlacom({ subdomain: 'demo', hooks });
		expect(plugin.hooks).toBe(hooks);
	});
});
