import { Collections } from './endpoints';
import { MetabaseOpenApiEndpoints } from './endpoints/openapi-endpoints';
import type { MetabaseContext } from './index';
import { metabaseAuthConfig, metabaseEndpointSchemas } from './index';

// Exercises the fixes from the live run against a self-hosted Metabase 0.65 (11-23) through the real
// endpoint wrapper and client, with fetch stubbed.

// `unknown`: test bodies are arbitrary JSON, including shapes the schemas must reject.
function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function buildContext(
	options: MetabaseContext['options'],
	baseUrl: string | null = null,
): MetabaseContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('account-1'),
		key: 'metabase-test-key',
		options,
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('metabase-test-key'),
			set_api_key: () => Promise.resolve(),
			get_base_url: () => Promise.resolve(baseUrl),
			set_base_url: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildContext({ baseUrl: 'https://metabase.test' });
const endpoints = { ...MetabaseOpenApiEndpoints, collections: Collections };

function requestedUrl(fetchMock: jest.SpyInstance): URL {
	return new URL(String(fetchMock.mock.calls[0]?.[0]));
}

describe('Metabase review fixes', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('uses the base_url stored on the account when no baseUrl option is set', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse([]));
		const accountCtx = buildContext({}, 'https://tenant.metabaseapp.com');
		await endpoints.collections.list(accountCtx, {});
		expect(requestedUrl(fetchMock).origin).toBe(
			'https://tenant.metabaseapp.com',
		);
	});

	it('declares base_url as an api_key account field', () => {
		expect(metabaseAuthConfig.api_key.account).toEqual(['base_url']);
	});

	it('rejects an empty path parameter instead of calling the parent route', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			endpoints.llm.putProvidersByKey(ctx, { path: { key: '' }, body: {} }),
		).rejects.toThrow('Metabase path parameter is invalid');
		// `as unknown as number`: an empty id is not a valid input type, which is the point of the check.
		await expect(
			endpoints.collections.get(ctx, { path: { id: '' as unknown as number } }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts legacy native queries on dataset operations', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				jsonResponse(
					{ status: 'completed', row_count: 1, data: { rows: [[18760]] } },
					202,
				),
			);
		const legacy = {
			database: 1,
			type: 'native' as const,
			native: { query: 'SELECT COUNT(*) AS n FROM ORDERS' },
		};
		await expect(
			endpoints.dataset.post(ctx, { body: legacy }),
		).resolves.toMatchObject({
			status: 'completed',
		});
		const sent = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
		expect(sent).toEqual(legacy);
		expect(
			metabaseEndpointSchemas['dataset.postByExportFormat'].input.safeParse({
				path: { 'export-format': 'csv' },
				body: { query: legacy },
			}).success,
		).toBe(true);
		expect(
			metabaseEndpointSchemas['dataset.post'].input.safeParse({
				body: { database: 1, type: 'graph' },
			}).success,
		).toBe(false);
	});

	it('forwards limit and offset on paged lists', async () => {
		const page = { data: [], models: [], limit: 25, offset: 50, total: 0 };
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(() => Promise.resolve(jsonResponse(page)));
		const query = { limit: 25, offset: 50 };
		await endpoints.collections.items.list(ctx, { path: { id: 3 }, query });
		await endpoints.collections.root.items.list(ctx, { query });
		await endpoints.collections.candidates.list(ctx, {
			path: { id: 3 },
			query,
		});
		await endpoints.collections.root.candidates.list(ctx, { query });
		await endpoints.metric.get(ctx, { query });
		await endpoints.task.getRuns(ctx, { query });
		await endpoints.notification.getAdmin(ctx, { query });
		await endpoints.ee.getMetabotAnalyticsConversations(ctx, { query });
		await endpoints.ee.getSupportAccessGrant(ctx, { query });
		for (const call of fetchMock.mock.calls) {
			const url = new URL(String(call[0]));
			expect(url.searchParams.get('limit')).toBe('25');
			expect(url.searchParams.get('offset')).toBe('50');
		}
		expect(fetchMock).toHaveBeenCalledTimes(9);
	});

	it('keeps response fields the OpenAPI document does not list', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			jsonResponse({
				id: 4,
				name: 'corsair-plugin-test',
				collection_id: 9,
				archived: false,
				icon: 'star',
			}),
		);
		const timeline = await endpoints.timeline.post(ctx, {
			body: { name: 'corsair-plugin-test' },
		});
		expect(timeline).toMatchObject({
			id: 4,
			name: 'corsair-plugin-test',
			collection_id: 9,
		});
	});

	it('reads launch responses as the HTTP body, not the server-side status/body map', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ message: null, run_id: 12 }, 202));
		await expect(
			endpoints.transform.postByIdRun(ctx, { path: { id: 1 } }),
		).resolves.toEqual({ message: null, run_id: 12 });
	});

	it('reports a malformed tuple as a validation failure instead of throwing from safeParse', () => {
		const output = metabaseEndpointSchemas['exploration.getDimensions'].output;
		expect(() =>
			output.safeParse({ metrics: [{ dimensions: [['-', {}, 'x']] }] }),
		).not.toThrow();
	});

	// Trimmed from Metabase 0.65's live responses: the OpenAPI document (built from internal malli specs)
	// names these keys in kebab-case and lists `insights` as an array, but the HTTP API sends snake_case
	// keys and `insights: null`.
	it('parses live responses whose keys and nulls differ from the OpenAPI document', () => {
		const dimensions = {
			metrics: [],
			dimension_groups: [
				{
					name: 'User ID',
					dimension_interestingness: null,
					dimensions: [
						{
							semantic_type: 'type/FK',
							group: {
								type: 'main',
								id: '3cb5ca80-a5cd-3135-b9a2-cf19f2dd1e91',
								display_name: 'Orders',
							},
							sources: [{ 'field-id': 11, type: 'field' }],
							name: 'USER_ID',
							has_field_values: 'none',
							effective_type: 'type/Integer',
							status: 'status/active',
							id: 'de1ee98e-ff32-3bcf-a938-9c6a9fde7920',
							display_name: 'User ID',
						},
					],
				},
			],
		};
		const parsedDimensions =
			metabaseEndpointSchemas['exploration.getDimensions'].output.safeParse(
				dimensions,
			);
		expect(parsedDimensions.success).toBe(true);
		expect(parsedDimensions.data).toEqual(dimensions);

		const metricMapping = {
			dimension_id: 'fef15e17-a43a-3533-b767-4ab915b7d096',
			target: ['field', { 'base-type': 'type/BigInteger' }, 9],
			table_id: 2,
			type: 'table',
		};
		expect(
			metabaseEndpointSchemas['metric.getById'].output.safeParse({
				id: 19,
				name: 'Number of Orders',
				dimension_mappings: [metricMapping],
			}).success,
		).toBe(true);

		expect(
			metabaseEndpointSchemas['dataset.post'].output.safeParse({
				status: 'completed',
				row_count: 1,
				data: { rows: [[18760]], cols: [], insights: null },
			}).success,
		).toBe(true);
	});

	it('returns a 429 with the provider delay when Retry-After is longer than the local cap', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{}', {
				status: 429,
				headers: { 'Retry-After': '120', 'Content-Type': 'application/json' },
			}),
		);
		await expect(endpoints.collections.list(ctx, {})).rejects.toMatchObject({
			status: 429,
			retryAfter: 120_000,
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('counts unrecognized fields instead of naming them', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			endpoints.collections.create(ctx, {
				body: { name: 'x', 'jane@example.com': true },
			} as never),
		).rejects.toThrow('body: 1 unrecognized field(s)');
		await expect(
			endpoints.collections.create(ctx, {
				body: { name: 'x', 'jane@example.com': true },
			} as never),
		).rejects.not.toThrow('jane@example.com');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts limit 0 for a count-only page', () => {
		expect(
			metabaseEndpointSchemas['collections.candidates.list'].input.safeParse({
				path: { id: 3 },
				query: { limit: 0 },
			}).success,
		).toBe(true);
		expect(
			metabaseEndpointSchemas['metric.get'].input.safeParse({
				query: { limit: 0 },
			}).success,
		).toBe(true);
	});

	it('requires the native or query part of a legacy query', () => {
		const input = metabaseEndpointSchemas['dataset.post'].input;
		expect(
			input.safeParse({ body: { database: 1, type: 'native' } }).success,
		).toBe(false);
		expect(
			input.safeParse({
				body: { database: 1, type: 'query', query: { 'source-table': 2 } },
			}).success,
		).toBe(true);
	});

	it('names the failing field when input validation fails', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			endpoints.collections.create(ctx, { body: { name: '' } }),
		).rejects.toThrow(/Metabase request input failed validation: body\.name: /);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
