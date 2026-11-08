import { logEventFromContext } from 'corsair/core';
import { DataboxAPIError } from './client';
import { Auth, Dashboards, DataSources, Datasets, Metrics } from './endpoints';
import {
	conflictFailed,
	conflictInProgress,
	dashboardList,
	dataSource as dataSourceFixture,
	dataSourceList,
	datasetData,
	dataset as datasetFixture,
	datasetList,
	ingestionDetail,
	ingestQueued,
	metricData,
	metricList,
	unauthorized,
	validationError,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'dbx-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.databox.com');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('auth.validateKey', () => {
	it('GETs the validation endpoint and reports valid', async () => {
		respond({ requestId: 'r', status: 'success' });

		const result = await invoke(Auth.validateKey, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v2/auth/validate-key',
			query: {},
			body: undefined,
		});
		expect(result).toEqual({ valid: true });
	});

	it('fails a 200 whose body does not say success', async () => {
		respond(validationError(), 200);

		await expect(invoke(Auth.validateKey, {})).rejects.toBeInstanceOf(
			DataboxAPIError,
		);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('surfaces an invalid key', async () => {
		respond(unauthorized, 401);

		await expect(invoke(Auth.validateKey, {})).rejects.toMatchObject({
			status: 401,
			code: 'unauthorized',
		});
	});
});

describe('dataSources.list', () => {
	it('GETs v2/data-sources with the filters and computes the next page', async () => {
		respond(dataSourceList);

		const result = await invoke(DataSources.list, {
			search: 'sales',
			page: 0,
			pageSize: 100,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v2/data-sources',
			query: { search: 'sales', page: '0', pageSize: '100' },
			body: undefined,
		});
		expect(result).toMatchObject({
			dataSources: [dataSourceFixture],
			page: 0,
			pageSize: 100,
			totalItems: 1000,
			nextPage: 1,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'databox.dataSources.list',
			{ count: 1, page: 0 },
			'completed',
		);
	});

	it('returns nextPage null on the last page', async () => {
		respond({
			requestId: 'r',
			status: 'success',
			data: {
				items: [dataSourceFixture],
				pagination: { page: 9, pageSize: 100, totalItems: 1000 },
			},
		});

		await expect(invoke(DataSources.list, { page: 9 })).resolves.toMatchObject({
			nextPage: null,
		});
	});

	it('sends x-account-id when an accountId is given', async () => {
		respond(dataSourceList);

		await invoke(DataSources.list, { accountId: 4754489 });

		expect(lastRequest().headers.get('x-account-id')).toBe('4754489');
	});

	it('rejects a body without the pagination block', async () => {
		respond({ requestId: 'r', status: 'success', data: { items: [] } });

		await expect(invoke(DataSources.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a body without items rather than reading an empty page', async () => {
		respond({
			requestId: 'r',
			status: 'success',
			data: { pagination: { page: 0, pageSize: 100, totalItems: 5 } },
		});

		await expect(invoke(DataSources.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a malformed known field', async () => {
		respond({
			requestId: 'r',
			status: 'success',
			data: {
				items: [{ ...dataSourceFixture, id: 'not-a-number' }],
				pagination: { page: 0, pageSize: 100, totalItems: 1 },
			},
		});

		await expect(invoke(DataSources.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});

	it.each([[{ page: -1 }], [{ page: 1.5 }], [{ pageSize: 0 }]])(
		'rejects %j before calling Databox',
		async (input) => {
			await expect(invoke(DataSources.list, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('surfaces a rejected parameter', async () => {
		respond(validationError('search'), 400);

		await expect(invoke(DataSources.list, {})).rejects.toMatchObject({
			status: 400,
			field: 'search',
		});
	});
});

describe('dataSources.create', () => {
	it('POSTs the name and timezone and unwraps the created source', async () => {
		respond({
			requestId: 'r',
			status: 'success',
			data: dataSourceFixture,
		});

		const result = await invoke(DataSources.create, {
			name: 'Sales',
			timezone: 'Europe/Ljubljana',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v2/data-sources',
			query: {},
			body: { name: 'Sales', timezone: 'Europe/Ljubljana' },
		});
		expect(result).toEqual({ dataSource: dataSourceFixture });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'databox.dataSources.create',
			{ dataSourceId: 1234567 },
			'completed',
		);
	});

	it('omits the timezone when not given and sends the idempotency key', async () => {
		respond({ requestId: 'r', status: 'success', data: dataSourceFixture });

		await invoke(DataSources.create, {
			name: 'Sales',
			idempotencyKey: 'key-1',
		});

		expect(lastRequest().body).toEqual({ name: 'Sales' });
		expect(lastRequest().headers.get('idempotency-key')).toBe('key-1');
	});

	it('is not replay-safe: a 5xx must not be replayed', async () => {
		respond(unauthorized, 502);

		const error = await invoke(DataSources.create, {
			name: 'Sales',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(DataboxAPIError);
		expect(error).toMatchObject({ status: 502, replaySafe: false });
	});

	it.each([[{}], [{ name: '' }], [{ timezone: 'Europe/Ljubljana' }]])(
		'rejects %j before calling Databox',
		async (input) => {
			await expect(invoke(DataSources.create, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('dataSources.get', () => {
	it('GETs one data source by ID', async () => {
		respond({ requestId: 'r', status: 'success', data: dataSourceFixture });

		const result = await invoke(DataSources.get, { id: 1234567 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v2/data-sources/1234567',
		});
		expect(result).toEqual({ dataSource: dataSourceFixture });
	});

	it('surfaces an unknown data source', async () => {
		respond(validationError(), 404);

		await expect(invoke(DataSources.get, { id: 1 })).rejects.toMatchObject({
			status: 404,
		});
	});
});

describe('dataSources.delete', () => {
	it('DELETEs the data source and keeps the outcome message', async () => {
		respond({
			requestId: 'r',
			status: 'success',
			data: { message: 'Data source deleted.' },
		});

		const result = await invoke(DataSources.remove, { id: 1234567 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v2/data-sources/1234567',
			body: undefined,
		});
		expect(result).toEqual({ message: 'Data source deleted.' });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'databox.dataSources.delete',
			{ dataSourceId: 1234567 },
			'completed',
		);
	});

	it('is not replay-safe', async () => {
		respond(unauthorized, 503);

		const error = await invoke(DataSources.remove, { id: 1 }).catch(
			(e: unknown) => e,
		);

		expect(error).toMatchObject({ status: 503, replaySafe: false });
	});

	it('surfaces a permission failure', async () => {
		respond(unauthorized, 403);

		await expect(invoke(DataSources.remove, { id: 1 })).rejects.toMatchObject({
			status: 403,
		});
	});
});

describe('datasets.list', () => {
	it('GETs v2/datasets with the filters', async () => {
		respond(datasetList);

		const result = await invoke(Datasets.list, {
			dataSourceId: 1234567,
			type: 'dataset',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v2/datasets',
			query: { dataSourceId: '1234567', type: 'dataset' },
		});
		expect(result).toMatchObject({
			datasets: [datasetFixture],
			nextPage: 1,
		});
	});

	it('rejects a type outside the documented enum before calling', async () => {
		await expect(
			invoke(Datasets.list, { type: 'federated' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('datasets.create', () => {
	it('POSTs the schema and primary key', async () => {
		respond({ requestId: 'r', status: 'success', data: datasetFixture });

		const result = await invoke(Datasets.create, {
			name: 'Transactions',
			dataSourceId: 1234567,
			primaryKey: ['transaction_id'],
			schema: [
				{ id: 'transaction_id', dataType: 'string' },
				{ id: 'amount', dataType: 'number' },
				{ id: 'occurred_at', dataType: 'datetime' },
			],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v2/datasets',
			body: {
				name: 'Transactions',
				dataSourceId: 1234567,
				primaryKey: ['transaction_id'],
				schema: [
					{ id: 'transaction_id', dataType: 'string' },
					{ id: 'amount', dataType: 'number' },
					{ id: 'occurred_at', dataType: 'datetime' },
				],
			},
		});
		expect(result).toEqual({ dataset: datasetFixture });
	});

	it.each([
		[{ name: 'T', dataSourceId: 1, schema: [] }],
		[
			{
				name: 'T',
				dataSourceId: 1,
				schema: [{ id: 'a', dataType: 'boolean' }],
			},
		],
		[{ name: 'T', dataSourceId: 1 }],
		[{ dataSourceId: 1, schema: [{ id: 'a', dataType: 'string' }] }],
	])('rejects %j before calling Databox', async (input) => {
		await expect(invoke(Datasets.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('datasets.get', () => {
	it('GETs one dataset by ID', async () => {
		respond({ requestId: 'r', status: 'success', data: datasetFixture });

		await expect(invoke(Datasets.get, { id: 2345678 })).resolves.toEqual({
			dataset: datasetFixture,
		});

		expect(lastRequest().path).toBe('/v2/datasets/2345678');
	});
});

describe('datasets.listData', () => {
	it('reads records, schema and paging together', async () => {
		respond(datasetData);

		const result = await invoke(Datasets.listData, {
			id: 2345678,
			sortBy: 'transaction_date',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v2/datasets/2345678/data',
			query: { sortBy: 'transaction_date' },
		});
		expect(result).toEqual({
			records: datasetData.data.items,
			schema: datasetData.data.schema,
			page: 0,
			pageSize: 100,
			totalItems: 1000,
			nextPage: 1,
			lastUpdatedAt: '2026-09-18T12:00:00.000+00:00',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'databox.datasets.listData',
			{ datasetId: 2345678, count: 1, page: 0 },
			'completed',
		);
	});

	it('rejects a record with a nested object value', async () => {
		respond({
			requestId: 'r',
			status: 'success',
			data: {
				items: [{ transaction_id: { nested: true } }],
				pagination: { page: 0, pageSize: 100, totalItems: 1 },
			},
		});

		await expect(invoke(Datasets.listData, { id: 1 })).rejects.toMatchObject({
			name: 'ZodError',
		});
	});

	it('rejects a body without items rather than reading an empty page', async () => {
		respond({
			requestId: 'r',
			status: 'success',
			data: { pagination: { page: 0, pageSize: 100, totalItems: 1 } },
		});

		await expect(invoke(Datasets.listData, { id: 1 })).rejects.toMatchObject({
			name: 'ZodError',
		});
	});

	it('surfaces a modification in progress', async () => {
		respond(conflictInProgress, 409, { 'Retry-After': '5' });

		await expect(invoke(Datasets.listData, { id: 1 })).rejects.toMatchObject({
			status: 409,
			code: 'modification_in_progress',
			retryAfter: 5000,
		});
	});
});

describe('datasets.ingestData', () => {
	const records = [
		{
			transaction_id: 'T-10024',
			transaction_date: '2026-09-18T09:12:00+00:00',
			product_name: 'Standing Desk',
			quantity: 2,
			unit_price: 249,
		},
	];

	it('POSTs the records and returns the ingestion ID', async () => {
		respond(ingestQueued);

		const result = await invoke(Datasets.ingestData, {
			id: 2345678,
			records,
			idempotencyKey: 'ingest-1',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v2/datasets/2345678/data',
			body: { records },
		});
		expect(lastRequest().headers.get('idempotency-key')).toBe('ingest-1');
		expect(result).toEqual({
			ingestionId: 'a4283796-bfde-42cf-aa65-1830d6692966',
			status: 'queued',
			message: 'Ingestion submitted.',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'databox.datasets.ingestData',
			{
				datasetId: 2345678,
				recordCount: 1,
				ingestionId: 'a4283796-bfde-42cf-aa65-1830d6692966',
			},
			'completed',
		);
	});

	it('never logs record contents', async () => {
		respond(ingestQueued);

		await invoke(Datasets.ingestData, { id: 1, records });

		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('Standing Desk');
	});

	it('is not replay-safe: a failed ingest must not be resent', async () => {
		respond(unauthorized, 500);

		const error = await invoke(Datasets.ingestData, {
			id: 1,
			records,
		}).catch((e: unknown) => e);

		expect(error).toMatchObject({ status: 500, replaySafe: false });
	});

	it('fails a 2xx envelope that says error, keeping the field', async () => {
		respond(validationError('records'), 200);

		await expect(
			invoke(Datasets.ingestData, { id: 1, records }),
		).rejects.toMatchObject({ code: 'invalid_input', field: 'records' });
	});

	it.each([
		[{ id: 1 }],
		[{ id: 1, records: [] }],
		[
			{
				id: 1,
				records: Array.from({ length: 501 }, (_, i) => ({ row: i })),
			},
		],
	])('rejects %j before calling Databox', async (input) => {
		await expect(invoke(Datasets.ingestData, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('datasets.getIngestion', () => {
	it('GETs the ingestion with its record counts', async () => {
		respond(ingestionDetail);

		const result = await invoke(Datasets.getIngestion, {
			id: 2345678,
			ingestionId: 'a4283796-bfde-42cf-aa65-1830d6692966',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v2/datasets/2345678/ingestions/a4283796-bfde-42cf-aa65-1830d6692966',
		});
		expect(result).toEqual({ ingestion: ingestionDetail.data });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'databox.datasets.getIngestion',
			{
				datasetId: 2345678,
				ingestionId: 'a4283796-bfde-42cf-aa65-1830d6692966',
				status: 'completed',
			},
			'completed',
		);
	});

	it('encodes the ingestion ID into one path segment', async () => {
		respond(ingestionDetail);

		await invoke(Datasets.getIngestion, {
			id: 1,
			ingestionId: 'a/b?c',
		});

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toBe(
			'https://api.databox.com/v2/datasets/1/ingestions/a%2Fb%3Fc',
		);
	});

	it('surfaces an unknown ingestion', async () => {
		respond(validationError(), 404);

		await expect(
			invoke(Datasets.getIngestion, { id: 1, ingestionId: 'nope' }),
		).rejects.toMatchObject({ status: 404 });
	});
});

describe('metrics.list', () => {
	it('GETs v2/metrics with the source filter', async () => {
		respond(metricList);

		const result = await invoke(Metrics.list, { sourceId: 1234567 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v2/metrics',
			query: { sourceId: '1234567' },
		});
		expect(result).toMatchObject({
			metrics: [expect.objectContaining({ id: 'GoogleAnalytics4@sessions' })],
			nextPage: 1,
		});
	});
});

describe('metrics.getData', () => {
	it('POSTs the date range and keeps null values for empty periods', async () => {
		respond(metricData);

		const result = await invoke(Metrics.getData, {
			id: 'GoogleAnalytics4@sessions',
			dateRange: { from: '2026-06-01', to: '2026-06-30', granularity: 'daily' },
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v2/metrics/GoogleAnalytics4%40sessions/data',
			body: {
				dateRange: {
					from: '2026-06-01',
					to: '2026-06-30',
					granularity: 'daily',
				},
			},
		});
		expect(result).toEqual({
			metric: metricData.data.metric,
			dataPoints: metricData.data.dataPoints,
			syncInfo: metricData.data.syncInfo,
		});
		// unknown: invoke returns unknown; the output schema above already
		// proved the shape.
		const points = (result as { dataPoints: { value: number | null }[] })
			.dataPoints;
		expect(points[1]?.value).toBeNull();
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'databox.metrics.getData',
			{
				metricId: 'GoogleAnalytics4@sessions',
				pointCount: 2,
				syncStatus: 'synced',
			},
			'completed',
		);
	});

	it('sends breakdowns and filters when given', async () => {
		respond(metricData);

		await invoke(Metrics.getData, {
			id: 'GoogleAnalytics4@sessions',
			dateRange: {
				from: '2026-06-01',
				to: '2026-06-30',
				granularity: 'monthly',
			},
			dimensionIds: ['sessionDefaultChannelGroup'],
			filters: {
				logicalOperator: 'and',
				conditions: [
					{
						type: 'dimension',
						field: 'sessionDefaultChannelGroup',
						operator: 'ANY_OF',
						values: ['Organic Search'],
					},
				],
			},
		});

		expect(lastRequest().body).toEqual({
			dateRange: {
				from: '2026-06-01',
				to: '2026-06-30',
				granularity: 'monthly',
			},
			dimensionIds: ['sessionDefaultChannelGroup'],
			filters: {
				logicalOperator: 'and',
				conditions: [
					{
						type: 'dimension',
						field: 'sessionDefaultChannelGroup',
						operator: 'ANY_OF',
						values: ['Organic Search'],
					},
				],
			},
		});
	});

	it('is replay-safe even though it POSTs', async () => {
		respond(unauthorized, 502);

		const error = await invoke(Metrics.getData, {
			id: 'GoogleAnalytics4@sessions',
			dateRange: { from: '2026-06-01', to: '2026-06-30', granularity: 'daily' },
		}).catch((e: unknown) => e);

		expect(error).toMatchObject({ status: 502, replaySafe: true });
	});

	it('rejects a body without dataPoints rather than reading as no data', async () => {
		respond({
			requestId: 'r',
			status: 'success',
			data: {
				metric: { id: 'GoogleAnalytics4@sessions', name: 'Sessions' },
				syncInfo: { status: 'synced' },
			},
		});

		await expect(
			invoke(Metrics.getData, {
				id: 'GoogleAnalytics4@sessions',
				dateRange: {
					from: '2026-06-01',
					to: '2026-06-30',
					granularity: 'daily',
				},
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it.each([
		[{ id: 'GoogleAnalytics4@sessions' }],
		[
			{
				id: 'GoogleAnalytics4@sessions',
				dateRange: {
					from: '2026-06-01',
					to: '2026-06-30',
					granularity: 'hourly',
				},
			},
		],
		[{ id: 'GoogleAnalytics4@sessions', dateRange: { from: '2026-06-01' } }],
		[
			{
				id: 'GoogleAnalytics4@sessions',
				dateRange: {
					from: '2026-06-01',
					to: '2026-06-30',
					granularity: 'daily',
				},
				filters: { conditions: [] },
			},
		],
	])('rejects %j before calling Databox', async (input) => {
		await expect(invoke(Metrics.getData, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces the per-minute rate limit with Retry-After', async () => {
		respond(unauthorized, 429, { 'Retry-After': '30' });

		await expect(
			invoke(Metrics.getData, {
				id: 'GoogleAnalytics4@sessions',
				dateRange: {
					from: '2026-06-01',
					to: '2026-06-30',
					granularity: 'daily',
				},
			}),
		).rejects.toMatchObject({ status: 429, retryAfter: 30000 });
	});
});

describe('dashboards.list', () => {
	it('GETs v2/dashboards with search and paging', async () => {
		respond(dashboardList);

		const result = await invoke(Dashboards.list, { search: 'sales' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v2/dashboards',
			query: { search: 'sales' },
		});
		expect(result).toEqual({
			dashboards: dashboardList.data.items,
			page: 0,
			pageSize: 100,
			totalItems: 1000,
			nextPage: 1,
		});
	});
});

describe('all endpoints share the envelope contract', () => {
	it('treats a 409 modification_failed as final, with no Retry-After use', async () => {
		respond(conflictFailed, 409);

		await expect(invoke(Datasets.listData, { id: 1 })).rejects.toMatchObject({
			status: 409,
			code: 'modification_failed',
		});
	});
});
