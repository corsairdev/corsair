import { logEventFromContext } from 'corsair/core';
import {
	isKeenAuthError,
	isKeenNotFound,
	isKeenQueryIncomplete,
	KeenAPIError,
} from './client';
import {
	Collections,
	Datasets,
	Events,
	Queries,
	SavedQueries,
} from './endpoints';
import {
	badRequest,
	collectionDetail,
	collections,
	countResult,
	dataset,
	datasetResult,
	datasets,
	eventCreated,
	eventsCreated,
	forbidden,
	groupedResult,
	intervalResult,
	invalidKey,
	lastDatasetsPage,
	multiAnalysisResult,
	property,
	queryIncomplete,
	resourceNotFound,
	savedQueries,
	savedQuery,
	savedQueryResult,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'abcdef0123456789abcdef0123456789';
const PROJECT_ID = '523b527836bf5a3216000006';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context carries what the endpoints read: ctx.key, the project
	// option, and the account key manager.
	const ctx = {
		key: API_KEY,
		options: { projectId: PROJECT_ID },
		keys: { get_project_id: jest.fn().mockResolvedValue(PROJECT_ID) },
	};
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(status === 204 ? null : JSON.stringify(body), {
			status,
			headers: status === 204 ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status = 204) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
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
	expect(sent.origin).toBe('https://api.keen.io');
	// Keen takes the key bare in the header, with no `Bearer` scheme.
	expect(sent.headers.get('authorization')).toBe(API_KEY);
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('events.record', () => {
	it('POSTs the event body and returns created', async () => {
		respond(eventCreated);

		await expect(
			invoke(Events.record, {
				collection: 'purchases',
				event: { item: 'Avocado', number_of_items: 10, user: { name: 'John' } },
			}),
		).resolves.toEqual({ created: true });
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/3.0/projects/${PROJECT_ID}/events/purchases`,
			body: { item: 'Avocado', number_of_items: 10, user: { name: 'John' } },
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
	});

	it('logs the collection and never the event body', async () => {
		respond(eventCreated);

		await invoke(Events.record, {
			collection: 'purchases',
			event: { email: 'jordan@acme.example', item: 'Avocado' },
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keen.events.record',
			{ collection: 'purchases', created: true },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('@');
	});

	it('encodes the collection into one path segment', async () => {
		respond(eventCreated);

		await invoke(Events.record, {
			collection: '../../events/other',
			event: { a: 1 },
		});

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toBe(
			`https://api.keen.io/3.0/projects/${PROJECT_ID}/events/..%2F..%2Fevents%2Fother`,
		);
	});

	it.each([
		[{}],
		[{ collection: 'purchases' }],
		[{ collection: '', event: {} }],
		[{ collection: 'purchases', event: 'not an object' }],
	])('rejects %j before calling Keen', async (input) => {
		await expect(invoke(Events.record, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('events.recordMany', () => {
	it('POSTs one body keyed by collection', async () => {
		respond(eventsCreated);

		const result = (await invoke(Events.recordMany, {
			events: {
				purchases: [{ item: 'Avocado' }, { item: 'Lime' }],
				signups: [{ username: 'lloyd' }, { username: 'harry' }],
			},
		})) as typeof eventsCreated;

		expect(result.purchases).toHaveLength(2);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/3.0/projects/${PROJECT_ID}/events`,
			body: {
				purchases: [{ item: 'Avocado' }, { item: 'Lime' }],
				signups: [{ username: 'lloyd' }, { username: 'harry' }],
			},
		});
	});

	it('counts what was stored, including a partial batch', async () => {
		respond(eventsCreated);

		await invoke(Events.recordMany, {
			events: {
				purchases: [{ item: 'Avocado' }],
				signups: [{ username: 'lloyd' }, { username: 'harry' }],
			},
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keen.events.recordMany',
			{ collections: 2, recorded: 3 },
			'completed',
		);
	});

	it.each([[{}], [{ events: { purchases: [] } }]])(
		'rejects %j before calling Keen',
		async (input) => {
			await expect(invoke(Events.recordMany, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('collections.list', () => {
	it('GETs every collection with its properties', async () => {
		respond(collections);

		const result = (await invoke(Collections.list, {})) as typeof collections;

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/3.0/projects/${PROJECT_ID}/events`,
		});
		expect(result).toHaveLength(2);
		expect(
			(result[0]?.properties as Record<string, string> | null)?.['item.price'],
		).toBe('num');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keen.collections.list',
			{ count: 2 },
			'completed',
		);
	});

	it('rejects a body that is not a collection list', async () => {
		respond({ unexpected: true });

		await expect(invoke(Collections.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});
});

describe('collections.get', () => {
	it('GETs one collection', async () => {
		respond(collectionDetail);

		await expect(
			invoke(Collections.get, { collection: 'purchases' }),
		).resolves.toMatchObject({ properties: { 'item.price': 'num' } });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/3.0/projects/${PROJECT_ID}/events/purchases`,
		});
	});
});

describe('properties.get', () => {
	it('GETs one property type, keeping the dots in its name', async () => {
		respond(property);

		await expect(
			invoke(Collections.property, {
				collection: 'purchases',
				property: 'item.price',
			}),
		).resolves.toEqual({ property_name: 'item.price', type: 'num' });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/3.0/projects/${PROJECT_ID}/events/purchases/properties/item.price`,
		});
	});
});

describe('queries.run', () => {
	it('POSTs a count analysis to its own endpoint', async () => {
		respond(countResult);

		await expect(
			invoke(Queries.run, {
				analysis_type: 'count',
				event_collection: 'purchases',
				timeframe: 'this_7_days',
			}),
		).resolves.toEqual({ result: 42 });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/3.0/projects/${PROJECT_ID}/queries/count`,
			body: {
				analysis_type: 'count',
				event_collection: 'purchases',
				timeframe: 'this_7_days',
			},
		});
	});

	it('sends a sum with its target property and filters', async () => {
		respond(countResult);

		await invoke(Queries.run, {
			analysis_type: 'sum',
			event_collection: 'purchases',
			target_property: 'price',
			timeframe: 'this_2_weeks',
			filters: [{ property_name: 'price', operator: 'gte', property_value: 1 }],
			group_by: ['platform'],
			order_by: [{ property_name: 'result', direction: 'DESC' }],
			limit: 20,
		});

		expect(lastRequest()).toMatchObject({
			path: `/3.0/projects/${PROJECT_ID}/queries/sum`,
			body: {
				analysis_type: 'sum',
				event_collection: 'purchases',
				target_property: 'price',
				timeframe: 'this_2_weeks',
				filters: [
					{ property_name: 'price', operator: 'gte', property_value: 1 },
				],
				group_by: ['platform'],
				order_by: [{ property_name: 'result', direction: 'DESC' }],
				limit: 20,
			},
		});
	});

	it('sends a percentile with its percentile value', async () => {
		respond(countResult);

		await invoke(Queries.run, {
			analysis_type: 'percentile',
			event_collection: 'purchases',
			target_property: 'price',
			percentile: 95,
		});

		expect(lastRequest().body).toEqual({
			analysis_type: 'percentile',
			event_collection: 'purchases',
			target_property: 'price',
			percentile: 95,
		});
	});

	it('keeps a grouped result as Keen sent it', async () => {
		respond(groupedResult);

		await expect(
			invoke(Queries.run, {
				analysis_type: 'count',
				event_collection: 'purchases',
				group_by: ['platform'],
			}),
		).resolves.toEqual(groupedResult);
	});

	it('keeps an interval result as Keen sent it', async () => {
		respond(intervalResult);

		await expect(
			invoke(Queries.run, {
				analysis_type: 'count',
				event_collection: 'purchases',
				interval: 'daily',
			}),
		).resolves.toEqual(intervalResult);
	});

	it('sends a funnel with its steps and no top-level collection', async () => {
		respond({ result: [3, 1], steps: [] });

		const steps = [
			{
				event_collection: 'signed up',
				actor_property: 'visitor.guid',
				timeframe: 'this_7_days',
			},
			{
				event_collection: 'completed profile',
				actor_property: 'user.guid',
				timeframe: 'this_7_days',
			},
		];
		await expect(
			invoke(Queries.run, { analysis_type: 'funnel', steps }),
		).resolves.toMatchObject({ result: [3, 1] });
		expect(lastRequest()).toMatchObject({
			path: `/3.0/projects/${PROJECT_ID}/queries/funnel`,
			body: { analysis_type: 'funnel', steps },
		});
	});

	it.each([
		['eq with a boolean', { operator: 'eq', property_value: true }],
		[
			'contains with a list element',
			{ operator: 'contains', property_value: 12 },
		],
		[
			'within with a geo point',
			{
				operator: 'within',
				property_value: {
					coordinates: [-122.42005, 37.77479],
					max_distance_miles: 30,
				},
			},
		],
	])('accepts a filter: %s', async (_, filter) => {
		respond(countResult);

		const filters = [{ property_name: 'item.on_sale', ...filter }];
		await invoke(Queries.run, {
			analysis_type: 'count',
			event_collection: 'purchases',
			filters,
		});

		expect(lastRequest().body).toMatchObject({ filters });
	});

	it('accepts an or filter with its operands', async () => {
		respond(countResult);

		const filters = [
			{
				operator: 'or',
				operands: [
					{ property_name: 'price', operator: 'gte', property_value: 9.99 },
					{
						property_name: 'customer.tier',
						operator: 'eq',
						property_value: 'premium',
					},
				],
			},
		];
		await invoke(Queries.run, {
			analysis_type: 'count',
			event_collection: 'purchases',
			filters,
		});

		expect(lastRequest().body).toMatchObject({ filters });
	});

	it.each([[[true, false]], [null], [['a', null]]])(
		'keeps a %j result, which select_unique or an empty average can return',
		async (value) => {
			respond({ result: value });

			await expect(
				invoke(Queries.run, {
					analysis_type: 'select_unique',
					event_collection: 'purchases',
					target_property: 'item.on_sale',
				}),
			).resolves.toEqual({ result: value });
		},
	);

	it.each([
		[{ analysis_type: 'sum', event_collection: 'purchases' }],
		[{ analysis_type: 'count' }],
		[{ analysis_type: 'funnel' }],
		[
			{
				analysis_type: 'count',
				event_collection: 'purchases',
				steps: [{ event_collection: 'a', actor_property: 'b' }],
			},
		],
		[
			{
				analysis_type: 'percentile',
				event_collection: 'purchases',
				target_property: 'price',
				percentile: 101,
			},
		],
		[
			{
				analysis_type: 'count',
				event_collection: 'purchases',
				filters: [
					{ property_name: 'a', operator: 'within', property_value: 'x' },
				],
			},
		],
		[
			{
				analysis_type: 'percentile',
				event_collection: 'purchases',
				target_property: 'price',
			},
		],
		[
			{
				analysis_type: 'sum',
				event_collection: 'purchases',
				target_property: 'price',
				percentile: 50,
			},
		],
		[
			{
				analysis_type: 'count',
				event_collection: 'purchases',
				filters: [
					{ property_name: 'a', operator: 'exists', property_value: 'x' },
				],
			},
		],
		[
			{
				analysis_type: 'count',
				event_collection: 'purchases',
				filters: [{ property_name: 'a', operator: 'in', property_value: 'x' }],
			},
		],
		[
			{
				analysis_type: 'count',
				event_collection: 'purchases',
				filters: [
					{ property_name: 'a', operator: 'gte', property_value: true },
				],
			},
		],
		[{ analysis_type: 'unknown', event_collection: 'purchases' }],
		[
			{
				analysis_type: 'count',
				event_collection: 'purchases',
				interval: 'fortnightly',
			},
		],
	])('rejects %j before calling Keen', async (input) => {
		await expect(invoke(Queries.run, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('queries.multiAnalysis', () => {
	it('reads an interval result, an array of labelled values', async () => {
		respond({
			result: [
				{
					timeframe: {
						start: '2026-11-01T00:00:00.000Z',
						end: '2026-11-02T00:00:00.000Z',
					},
					value: { purchases: 3, revenue: 120 },
				},
			],
		});

		await expect(
			invoke(Queries.multiAnalysis, {
				event_collection: 'purchases',
				analyses: {
					purchases: { analysis_type: 'count' },
					revenue: { analysis_type: 'sum', target_property: 'price' },
				},
				timeframe: 'this_7_days',
				interval: 'daily',
			}),
		).resolves.toMatchObject({
			result: [{ value: { purchases: 3, revenue: 120 } }],
		});
	});

	it('reads a grouped result, an array of rows', async () => {
		respond({ result: [{ 'item.name': 'Widget', purchases: 3 }] });

		await expect(
			invoke(Queries.multiAnalysis, {
				event_collection: 'purchases',
				analyses: { purchases: { analysis_type: 'count' } },
				group_by: ['item.name'],
			}),
		).resolves.toMatchObject({
			result: [{ 'item.name': 'Widget', purchases: 3 }],
		});
	});

	it('takes entries without their own collection, as Keen documents them', async () => {
		respond(multiAnalysisResult);

		await invoke(Queries.multiAnalysis, {
			event_collection: 'purchases',
			analyses: {
				purchases: { analysis_type: 'count' },
				revenue: { analysis_type: 'sum', target_property: 'price' },
			},
			timeframe: 'this_7_days',
		});

		expect(lastRequest().body).toEqual({
			event_collection: 'purchases',
			analyses: {
				purchases: { analysis_type: 'count' },
				revenue: { analysis_type: 'sum', target_property: 'price' },
			},
			timeframe: 'this_7_days',
		});
	});

	it('POSTs labelled analyses to the multi_analysis endpoint', async () => {
		respond(multiAnalysisResult);

		await expect(
			invoke(Queries.multiAnalysis, {
				event_collection: 'purchases',
				analyses: {
					purchases: { analysis_type: 'count', event_collection: 'purchases' },
					revenue: {
						analysis_type: 'sum',
						event_collection: 'purchases',
						target_property: 'price',
					},
				},
				timeframe: 'this_7_days',
			}),
		).resolves.toEqual(multiAnalysisResult);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/3.0/projects/${PROJECT_ID}/queries/multi_analysis`,
		});
		expect(lastRequest().body).toMatchObject({
			event_collection: 'purchases',
			analyses: { purchases: { analysis_type: 'count' } },
			timeframe: 'this_7_days',
		});
	});

	it('refuses more than the ten analyses Keen takes', async () => {
		const analyses = Object.fromEntries(
			Array.from({ length: 11 }, (_, index) => [
				`a${index}`,
				{ analysis_type: 'count' as const, event_collection: 'purchases' },
			]),
		);

		await expect(
			invoke(Queries.multiAnalysis, {
				event_collection: 'purchases',
				analyses,
			}),
		).rejects.toThrow('at most 10 analyses');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([[{}], [{ event_collection: 'purchases' }], [{ analyses: {} }]])(
		'rejects %j before calling Keen',
		async (input) => {
			await expect(invoke(Queries.multiAnalysis, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('savedQueries.list', () => {
	it('GETs every saved query', async () => {
		respond(savedQueries);

		// unknown[]: the test only counts the saved queries, not their fields.
		const result = (await invoke(SavedQueries.list, {})) as {
			queries: unknown[];
		};

		expect(result.queries).toHaveLength(2);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/3.0/projects/${PROJECT_ID}/queries/saved`,
		});
	});
});

describe('savedQueries.get', () => {
	it('GETs one saved query definition', async () => {
		respond(savedQuery);

		await expect(
			invoke(SavedQueries.get, { queryName: 'weekly-purchases' }),
		).resolves.toMatchObject({ query_name: 'weekly-purchases' });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/3.0/projects/${PROJECT_ID}/queries/saved/weekly-purchases`,
		});
	});
});

describe('savedQueries.create', () => {
	it('saves a multi-analysis with its analyses map', async () => {
		respond(savedQuery);

		await invoke(SavedQueries.create, {
			queryName: 'weekly-totals',
			refresh_rate: 0,
			query: {
				analysis_type: 'multi_analysis',
				event_collection: 'purchases',
				analyses: { purchases: { analysis_type: 'count' } },
				timeframe: 'this_7_days',
			},
		});

		expect(lastRequest().body).toEqual({
			refresh_rate: 0,
			query: {
				analysis_type: 'multi_analysis',
				event_collection: 'purchases',
				analyses: { purchases: { analysis_type: 'count' } },
				timeframe: 'this_7_days',
			},
		});
	});

	it('PUTs the definition under its name', async () => {
		respond({ ...savedQuery, created: true });

		await expect(
			invoke(SavedQueries.create, {
				queryName: 'weekly-purchases',
				refresh_rate: 0,
				query: {
					analysis_type: 'count',
					event_collection: 'purchases',
					timeframe: 'this_7_days',
				},
			}),
		).resolves.toMatchObject({ query_name: 'weekly-purchases' });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/3.0/projects/${PROJECT_ID}/queries/saved/weekly-purchases`,
			body: {
				refresh_rate: 0,
				query: {
					analysis_type: 'count',
					event_collection: 'purchases',
					timeframe: 'this_7_days',
				},
			},
		});
	});

	it('sends a display name when given', async () => {
		respond(savedQuery);

		await invoke(SavedQueries.create, {
			queryName: 'weekly-purchases',
			refresh_rate: 14400,
			query: { analysis_type: 'count', event_collection: 'purchases' },
			metadata: { display_name: 'Purchases (past week)' },
		});

		expect(lastRequest().body).toMatchObject({
			refresh_rate: 14400,
			metadata: { display_name: 'Purchases (past week)' },
		});
	});

	it.each([
		[
			{
				queryName: 'x',
				query: { analysis_type: 'count', event_collection: 'p' },
			},
		],
		[
			{
				queryName: '',
				refresh_rate: 0,
				query: { analysis_type: 'count', event_collection: 'p' },
			},
		],
		[
			{
				queryName: 'x',
				refresh_rate: -1,
				query: { analysis_type: 'count', event_collection: 'p' },
			},
		],
		[
			{
				queryName: 'x',
				refresh_rate: 60,
				query: { analysis_type: 'count', event_collection: 'p' },
			},
		],
		[
			{
				queryName: 'x',
				refresh_rate: 86401,
				query: { analysis_type: 'count', event_collection: 'p' },
			},
		],
		[
			{
				queryName: 'x',
				refresh_rate: 0,
				query: { analysis_type: 'sum', event_collection: 'p' },
			},
		],
	])('rejects %j before calling Keen', async (input) => {
		await expect(invoke(SavedQueries.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('savedQueries.result', () => {
	it('GETs the cached result', async () => {
		respond(savedQueryResult);

		await expect(
			invoke(SavedQueries.result, { queryName: 'weekly-purchases' }),
		).resolves.toMatchObject({
			query_name: 'weekly-purchases',
			result: [
				{ platform: 'Mobile', result: 1283.04 },
				{ platform: 'Web', result: 323.73 },
			],
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/3.0/projects/${PROJECT_ID}/queries/saved/weekly-purchases/result`,
		});
	});

	it('keeps a cached multi-analysis result keyed by label', async () => {
		respond({
			...savedQueryResult,
			result: { purchases: 42, revenue: 1283.04 },
		});

		await expect(
			invoke(SavedQueries.result, { queryName: 'weekly-purchases' }),
		).resolves.toMatchObject({ result: { purchases: 42, revenue: 1283.04 } });
	});
});

describe('savedQueries.delete', () => {
	it('DELETEs the query and reports it is gone', async () => {
		respondEmpty(204);

		await expect(
			invoke(SavedQueries.remove, { queryName: 'weekly-purchases' }),
		).resolves.toEqual({ success: true });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/3.0/projects/${PROJECT_ID}/queries/saved/weekly-purchases`,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keen.savedQueries.delete',
			{ queryName: 'weekly-purchases' },
			'completed',
		);
	});

	it('throws on a missing query rather than reporting success', async () => {
		respond(resourceNotFound, 404);

		await expect(
			invoke(SavedQueries.remove, { queryName: 'nope' }),
		).rejects.toMatchObject({
			status: 404,
			body: { error_code: 'ResourceNotFoundError' },
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('datasets.list', () => {
	it('GETs a page and reads the cursor out of next_page_url', async () => {
		respond(datasets);

		const result = (await invoke(Datasets.list, {})) as {
			datasets: typeof datasets.datasets;
			next_after_name: string | null;
		};

		expect(result.datasets).toHaveLength(1);
		expect(result.next_after_name).toBe('count-purchases-by-country-daily');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/3.0/projects/${PROJECT_ID}/datasets`,
		});
		expect(lastRequest().query).toEqual({});
	});

	it('reports no cursor on the last page', async () => {
		respond(lastDatasetsPage);

		await expect(invoke(Datasets.list, {})).resolves.toMatchObject({
			next_after_name: null,
		});
	});

	it('sends the page size and the cursor', async () => {
		respond(datasets);

		await invoke(Datasets.list, { limit: 50, after_name: 'dataset_foo' });

		expect(lastRequest().query).toEqual({
			limit: '50',
			after_name: 'dataset_foo',
		});
	});

	it('leaves the cursor null when the URL carries no usable one', async () => {
		respond({
			datasets: [dataset],
			next_page_url:
				'https://api.keen.io/3.0/projects/p/datasets?limit=1&after_name=',
		});

		await expect(invoke(Datasets.list, {})).resolves.toMatchObject({
			next_after_name: null,
		});
	});

	it.each([[{ limit: 0 }], [{ limit: 101 }], [{ after_name: '' }]])(
		'rejects %j before calling Keen',
		async (input) => {
			await expect(invoke(Datasets.list, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('datasets.get', () => {
	it('GETs one dataset definition', async () => {
		respond(dataset);

		await expect(
			invoke(Datasets.get, { datasetName: 'count-purchases-by-country-daily' }),
		).resolves.toMatchObject({
			dataset_name: 'count-purchases-by-country-daily',
			status: 'OK',
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/3.0/projects/${PROJECT_ID}/datasets/count-purchases-by-country-daily`,
		});
	});
});

describe('datasets.result', () => {
	it('GETs the rows for an index value', async () => {
		respond(datasetResult);

		await expect(
			invoke(Datasets.result, {
				datasetName: 'count-purchases-by-country-daily',
				index_by: { country: 'US' },
				timeframe: 'this_7_days',
			}),
		).resolves.toEqual(datasetResult);
		// Keen reads the index from one `index_by` parameter, JSON-encoded when it
		// is an object.
		expect(lastRequest().query).toEqual({
			index_by: '{"country":"US"}',
			timeframe: 'this_7_days',
		});
	});

	// index_by can be a customer value (an email, an account), so a failed read
	// keeps neither the query nor the URL's query string on the error.
	it('keeps the index_by value off the error when the read fails', async () => {
		respond({ error_code: 'ResourceNotFoundError', message: 'nope' }, 404);

		const error = await caught(
			invoke(Datasets.result, {
				datasetName: 'count-purchases-by-country-daily',
				index_by: { email: 'person@example.com' },
				timeframe: 'this_7_days',
			}),
		);

		expect(error).toMatchObject({ status: 404 });
		expect((error as { url: string }).url).not.toContain('?');
		expect(JSON.stringify(error)).not.toContain('person');
		expect(String(error)).not.toContain('person');
	});

	it('sends a single string index value as it is', async () => {
		respond(datasetResult);

		await invoke(Datasets.result, {
			datasetName: 'count-purchases-by-country-daily',
			index_by: 'US',
			timeframe: 'this_7_days',
		});

		expect(lastRequest().query).toEqual({
			index_by: 'US',
			timeframe: 'this_7_days',
		});
	});

	it('takes number and boolean index values', async () => {
		respond(datasetResult);

		await invoke(Datasets.result, {
			datasetName: 'by-store',
			index_by: { 'store.id': 5, 'store.open': true },
			timeframe: 'this_7_days',
		});

		expect(lastRequest().query.index_by).toBe(
			'{"store.id":5,"store.open":true}',
		);
	});

	it.each([
		[{ datasetName: 'd', timeframe: 'this_7_days' }],
		[{ datasetName: 'd', index_by: 'US' }],
	])('rejects %j, which lacks a required parameter', async (input) => {
		await expect(invoke(Datasets.result, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends an absolute timeframe JSON-encoded', async () => {
		respond(datasetResult);

		await invoke(Datasets.result, {
			datasetName: 'count-purchases-by-country-daily',
			index_by: 'US',
			timeframe: {
				start: '2026-11-01T00:00:00.000Z',
				end: '2026-11-08T00:00:00.000Z',
			},
		});

		expect(lastRequest().query.timeframe).toBe(
			'{"start":"2026-11-01T00:00:00.000Z","end":"2026-11-08T00:00:00.000Z"}',
		);
	});
});

describe('datasets.delete', () => {
	it('DELETEs the dataset', async () => {
		respondEmpty(204);

		await expect(
			invoke(Datasets.remove, {
				datasetName: 'count-purchases-by-country-daily',
			}),
		).resolves.toEqual({ success: true });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/3.0/projects/${PROJECT_ID}/datasets/count-purchases-by-country-daily`,
		});
	});
});

describe('the key', () => {
	it('sends ctx.key, the key a hook may have replaced, not the option', async () => {
		respond(collections);

		const ctx = {
			key: 'hook-replaced-key',
			options: { key: 'option-key', projectId: PROJECT_ID },
			keys: { get_project_id: jest.fn().mockResolvedValue(PROJECT_ID) },
		};
		await (Collections.list as never as AnyEndpoint)(ctx as never, {} as never);

		const [, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(new Headers(init.headers).get('authorization')).toBe(
			'hook-replaced-key',
		);
	});
});

describe('the project ID', () => {
	it('falls back to the stored credential', async () => {
		respond(collections);

		const ctx = {
			key: API_KEY,
			options: {},
			keys: { get_project_id: jest.fn().mockResolvedValue('stored-project') },
		};
		await (Collections.list as never as AnyEndpoint)(ctx as never, {} as never);

		expect(lastRequest().path).toBe('/3.0/projects/stored-project/events');
	});

	it('fails before a request when no project ID is known', async () => {
		const ctx = {
			key: API_KEY,
			options: {},
			keys: { get_project_id: jest.fn().mockResolvedValue(null) },
		};

		const error = await caught(
			(Collections.list as never as AnyEndpoint)(ctx as never, {} as never),
		);

		expect(error).toBeInstanceOf(KeenAPIError);
		expect(String(error)).toContain('project ID');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error envelopes', () => {
	it('keeps the key out of the message Keen echoes it in', async () => {
		respond(invalidKey(API_KEY), 401);

		const error = await caught(invoke(Collections.list, {}));

		expect(error).toMatchObject({
			status: 401,
			body: { error_code: 'InvalidApiKeyError' },
		});
		expect(isKeenAuthError(error)).toBe(true);
		expect(String(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it('reads an unknown project as not found', async () => {
		respond(resourceNotFound, 404);

		const error = await caught(
			invoke(Collections.get, { collection: 'purchases' }),
		);

		expect(error).toMatchObject({
			status: 404,
			body: { error_code: 'ResourceNotFoundError' },
		});
		expect(isKeenNotFound(error)).toBe(true);
	});

	it('reads a malformed analysis as a validation failure', async () => {
		respond(badRequest, 400);

		expect(
			String(
				await caught(
					invoke(Queries.run, {
						analysis_type: 'sum',
						event_collection: 'purchases',
						target_property: 'price',
					}),
				),
			),
		).toContain('PropertyDoesNotExistError');
	});

	it('reads a forbidden call as a permission failure', async () => {
		respond(forbidden, 403);

		await expect(
			invoke(Events.record, { collection: 'purchases', event: {} }),
		).rejects.toMatchObject({
			status: 403,
			body: { error_code: 'ForbiddenError' },
		});
	});

	it('marks the five minute timeout as an incomplete query', async () => {
		respond(queryIncomplete, 504);

		const error = await caught(
			invoke(Queries.run, {
				analysis_type: 'count',
				event_collection: 'purchases',
			}),
		);
		expect(error).toMatchObject({
			status: 504,
			body: { error_code: 'QueryIncompleteError' },
		});
		expect(isKeenQueryIncomplete(error)).toBe(true);
	});

	it('keeps no body on the error, so an echoed event cannot follow it into a log', async () => {
		respond(badRequest, 400);

		const error = await caught(
			invoke(Events.record, { collection: 'p', event: {} }),
		);

		expect(error).toMatchObject({
			body: { error_code: 'PropertyDoesNotExistError' },
		});
		expect(require('node:util').inspect(error, { depth: 10 })).not.toContain(
			badRequest.message,
		);
	});

	it('turns a dropped connection into a transport error with the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			invoke(Events.record, { collection: 'p', event: {} }),
		).rejects.toMatchObject({
			transport: true,
			method: 'POST',
			message: 'fetch failed',
		});
	});

	it('refuses an event collection with no name', async () => {
		await expect(
			invoke(Events.record, { collection: '', event: {} }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});

describe('logging', () => {
	it('never logs a filter value, which can carry a customer value', async () => {
		respond(countResult);

		await invoke(Queries.run, {
			analysis_type: 'sum',
			event_collection: 'purchases',
			target_property: 'price',
			filters: [
				{
					property_name: 'user.email',
					operator: 'eq',
					property_value: 'a@b.example',
				},
			],
		});

		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('@');
	});
});
