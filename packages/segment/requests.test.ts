import { SEGMENT_API_BASE } from './client';
import {
	Catalog,
	Destinations,
	Functions,
	Regulations,
	Sources,
	TrackingPlans,
	Warehouses,
	Workspaces,
} from './endpoints';
import {
	DESTINATION,
	DESTINATION_METADATA,
	FUNCTION,
	paginated,
	RULE,
	SOURCE,
	SOURCE_METADATA,
	sourceEnvelope,
	TRACKING_PLAN,
	WAREHOUSE,
	workspaceEnvelope,
} from './test-fixtures';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is left untyped.
// unknown: each endpoint has its own output type, so no shared return type
// exists narrower than unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = 'sst-test-token';

// One row per operation: the call, its input, and the request the API must
// see. `query` and `body` are matched exactly; `path` against the URL path.
const CASES: {
	name: string;
	endpoint: AnyEndpoint;
	// unknown: the mocked response body differs per operation.
	respondWith: unknown;
	// unknown: each operation takes its own input shape; a union of all 52
	// would obscure which fields each row needs.
	input: Record<string, unknown>;
	method: string;
	path: string;
	query?: Record<string, string>;
	// unknown: the request body differs per operation; rows without one omit it.
	body?: unknown;
}[] = [
	{
		name: 'workspaces.get',
		endpoint: Workspaces.get as AnyEndpoint,
		respondWith: workspaceEnvelope,
		input: {},
		method: 'GET',
		path: '/',
	},
	{
		name: 'sources.list',
		endpoint: Sources.list as AnyEndpoint,
		respondWith: paginated([SOURCE], 'sources'),
		input: {},
		method: 'GET',
		path: '/sources',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'sources.get',
		endpoint: Sources.get as AnyEndpoint,
		respondWith: sourceEnvelope,
		input: { sourceId: 'qQ1' },
		method: 'GET',
		path: '/sources/qQ1',
	},
	{
		name: 'sources.create',
		endpoint: Sources.create as AnyEndpoint,
		respondWith: { data: { source: SOURCE } },
		input: {
			slug: 'swift',
			metadataId: 'dZeHygTSD4',
			enabled: true,
			settings: { websiteUrl: 'https://example.com' },
		},
		method: 'POST',
		path: '/sources',
		body: {
			slug: 'swift',
			metadataId: 'dZeHygTSD4',
			enabled: true,
			settings: { websiteUrl: 'https://example.com' },
		},
	},
	{
		name: 'sources.update',
		endpoint: Sources.update as AnyEndpoint,
		respondWith: { data: { source: SOURCE } },
		input: { sourceId: 'qQ1', name: 'Swift prod', enabled: false },
		method: 'PATCH',
		path: '/sources/qQ1',
		body: { name: 'Swift prod', enabled: false },
	},
	{
		name: 'sources.delete',
		endpoint: Sources.remove as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { sourceId: 'qQ1' },
		method: 'DELETE',
		path: '/sources/qQ1',
	},
	{
		name: 'sources.listConnectedDestinations',
		endpoint: Sources.listConnectedDestinations as AnyEndpoint,
		respondWith: paginated([DESTINATION], 'destinations'),
		input: { sourceId: 'qQ1', count: 50, cursor: 'Mg==' },
		method: 'GET',
		path: '/sources/qQ1/connected-destinations',
		query: { 'pagination.count': '50', 'pagination.cursor': 'Mg==' },
	},
	{
		name: 'sources.listConnectedWarehouses',
		endpoint: Sources.listConnectedWarehouses as AnyEndpoint,
		respondWith: paginated([WAREHOUSE], 'warehouses'),
		input: { sourceId: 'qQ1' },
		method: 'GET',
		path: '/sources/qQ1/connected-warehouses',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'sources.updateSchemaSettings',
		endpoint: Sources.updateSchemaSettings as AnyEndpoint,
		respondWith: { data: { sourceId: 'qQ1', settings: {} } },
		input: {
			sourceId: 'qQ1',
			settings: { track: { allowUnplannedEvents: false } },
		},
		method: 'PATCH',
		path: '/sources/qQ1/settings',
		body: { track: { allowUnplannedEvents: false } },
	},
	{
		name: 'sources.createWriteKey',
		endpoint: Sources.createWriteKey as AnyEndpoint,
		respondWith: { data: { source: SOURCE } },
		input: { sourceId: 'qQ1' },
		method: 'POST',
		path: '/sources/qQ1/writekey',
		body: undefined,
	},
	{
		name: 'sources.removeWriteKey',
		endpoint: Sources.removeWriteKey as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { sourceId: 'qQ1', writeKey: 'bEj5MzDqCkHYRqreZgbPuH' },
		method: 'DELETE',
		path: '/sources/qQ1/writekey/bEj5MzDqCkHYRqreZgbPuH',
	},
	{
		name: 'destinations.list',
		endpoint: Destinations.list as AnyEndpoint,
		respondWith: paginated([DESTINATION], 'destinations'),
		input: {},
		method: 'GET',
		path: '/destinations',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'destinations.get',
		endpoint: Destinations.get as AnyEndpoint,
		respondWith: { data: { destination: DESTINATION } },
		input: { destinationId: 'rh5' },
		method: 'GET',
		path: '/destinations/rh5',
	},
	{
		name: 'destinations.create',
		endpoint: Destinations.create as AnyEndpoint,
		respondWith: { data: { destination: DESTINATION } },
		input: {
			sourceId: 'qQ1',
			metadataId: '5gPpjD6ikn',
			settings: { key: 'v' },
		},
		method: 'POST',
		path: '/destinations',
		body: {
			sourceId: 'qQ1',
			metadataId: '5gPpjD6ikn',
			settings: { key: 'v' },
		},
	},
	{
		name: 'destinations.update',
		endpoint: Destinations.update as AnyEndpoint,
		respondWith: { data: { destination: DESTINATION } },
		input: { destinationId: 'rh5', enabled: false },
		method: 'PATCH',
		path: '/destinations/rh5',
		body: { enabled: false },
	},
	{
		name: 'destinations.delete',
		endpoint: Destinations.remove as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { destinationId: 'rh5' },
		method: 'DELETE',
		path: '/destinations/rh5',
	},
	{
		name: 'warehouses.list',
		endpoint: Warehouses.list as AnyEndpoint,
		respondWith: paginated([WAREHOUSE], 'warehouses'),
		input: {},
		method: 'GET',
		path: '/warehouses',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'warehouses.get',
		endpoint: Warehouses.get as AnyEndpoint,
		respondWith: { data: { warehouse: WAREHOUSE } },
		input: { warehouseId: 'kjU' },
		method: 'GET',
		path: '/warehouses/kjU',
	},
	{
		name: 'warehouses.getConnectionState',
		endpoint: Warehouses.getConnectionState as AnyEndpoint,
		respondWith: { data: { connectionState: 'CONNECTED' } },
		input: { warehouseId: 'kjU' },
		method: 'GET',
		path: '/warehouses/kjU/connection-state',
	},
	{
		name: 'warehouses.listConnectedSources',
		endpoint: Warehouses.listConnectedSources as AnyEndpoint,
		respondWith: paginated([SOURCE], 'sources'),
		input: { warehouseId: 'kjU' },
		method: 'GET',
		path: '/warehouses/kjU/connected-sources',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'warehouses.validate',
		endpoint: Warehouses.validate as AnyEndpoint,
		respondWith: { data: { status: 'FAILED' } },
		input: {
			metadataId: '55d3d3aea3c',
			settings: { host: 'db.example.com', database: 'analytics' },
		},
		method: 'POST',
		path: '/warehouses/validation',
		body: {
			metadataId: '55d3d3aea3c',
			settings: { host: 'db.example.com', database: 'analytics' },
		},
	},
	{
		name: 'warehouses.create',
		endpoint: Warehouses.create as AnyEndpoint,
		respondWith: { data: { warehouse: WAREHOUSE } },
		input: {
			metadataId: '55d3d3aea3c',
			settings: { host: 'db.example.com', database: 'analytics' },
		},
		method: 'POST',
		path: '/warehouses',
		body: {
			metadataId: '55d3d3aea3c',
			settings: { host: 'db.example.com', database: 'analytics' },
		},
	},
	{
		name: 'warehouses.update',
		endpoint: Warehouses.update as AnyEndpoint,
		respondWith: { data: { warehouse: WAREHOUSE } },
		input: {
			warehouseId: 'kjU',
			enabled: false,
			settings: { host: 'db.example.com' },
		},
		method: 'PATCH',
		path: '/warehouses/kjU',
		body: { enabled: false, settings: { host: 'db.example.com' } },
	},
	{
		name: 'warehouses.addSourceConnection',
		endpoint: Warehouses.addSourceConnection as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { warehouseId: 'kjU', sourceId: 'qQ1' },
		method: 'POST',
		path: '/warehouses/kjU/connected-sources/qQ1',
		body: undefined,
	},
	{
		name: 'warehouses.delete',
		endpoint: Warehouses.remove as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { warehouseId: 'kjU' },
		method: 'DELETE',
		path: '/warehouses/kjU',
	},
	{
		name: 'warehouses.removeSourceConnection',
		endpoint: Warehouses.removeSourceConnection as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { warehouseId: 'kjU', sourceId: 'qQ1' },
		method: 'DELETE',
		path: '/warehouses/kjU/connected-sources/qQ1',
	},
	{
		name: 'trackingPlans.list',
		endpoint: TrackingPlans.list as AnyEndpoint,
		respondWith: paginated([TRACKING_PLAN], 'trackingPlans'),
		input: { type: 'LIVE' },
		method: 'GET',
		path: '/tracking-plans',
		query: { type: 'LIVE', 'pagination.count': '200' },
	},
	{
		name: 'trackingPlans.get',
		endpoint: TrackingPlans.get as AnyEndpoint,
		respondWith: { data: { trackingPlan: TRACKING_PLAN } },
		input: { trackingPlanId: 'tp_1' },
		method: 'GET',
		path: '/tracking-plans/tp_1',
	},
	{
		name: 'trackingPlans.listRules',
		endpoint: TrackingPlans.listRules as AnyEndpoint,
		respondWith: paginated([RULE], 'rules'),
		input: { trackingPlanId: 'tp_1' },
		method: 'GET',
		path: '/tracking-plans/tp_1/rules',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'trackingPlans.listSources',
		endpoint: TrackingPlans.listSources as AnyEndpoint,
		respondWith: paginated([SOURCE], 'sources'),
		input: { trackingPlanId: 'tp_1' },
		method: 'GET',
		path: '/tracking-plans/tp_1/sources',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'trackingPlans.create',
		endpoint: TrackingPlans.create as AnyEndpoint,
		respondWith: { data: { trackingPlan: TRACKING_PLAN } },
		input: { name: 'Mobile plan', type: 'TEMPLATE' },
		method: 'POST',
		path: '/tracking-plans',
		body: { name: 'Mobile plan', type: 'TEMPLATE' },
	},
	{
		name: 'trackingPlans.update',
		endpoint: TrackingPlans.update as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { trackingPlanId: 'tp_1', name: 'Mobile plan v2' },
		method: 'PATCH',
		path: '/tracking-plans/tp_1',
		body: { name: 'Mobile plan v2' },
	},
	{
		name: 'trackingPlans.replaceRules',
		endpoint: TrackingPlans.replaceRules as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: {
			trackingPlanId: 'tp_1',
			rules: [
				{ type: 'TRACK', key: 'Order Completed', jsonSchema: {}, version: 1 },
			],
		},
		method: 'PUT',
		path: '/tracking-plans/tp_1/rules',
		body: {
			rules: [
				{ type: 'TRACK', key: 'Order Completed', jsonSchema: {}, version: 1 },
			],
		},
	},
	{
		name: 'trackingPlans.addSource',
		endpoint: TrackingPlans.addSource as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { trackingPlanId: 'tp_1', sourceId: 'qQ1' },
		method: 'POST',
		path: '/tracking-plans/tp_1/sources',
		body: { sourceId: 'qQ1' },
	},
	{
		name: 'trackingPlans.delete',
		endpoint: TrackingPlans.remove as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { trackingPlanId: 'tp_1' },
		method: 'DELETE',
		path: '/tracking-plans/tp_1',
	},
	{
		name: 'trackingPlans.removeSource',
		endpoint: TrackingPlans.removeSource as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { trackingPlanId: 'tp_1', sourceId: 'qQ1' },
		method: 'DELETE',
		path: '/tracking-plans/tp_1/sources',
		query: { sourceId: 'qQ1' },
	},
	{
		name: 'functions.list',
		endpoint: Functions.list as AnyEndpoint,
		respondWith: paginated([FUNCTION], 'functions'),
		input: { resourceType: 'SOURCE' },
		method: 'GET',
		path: '/functions',
		query: { resourceType: 'SOURCE', 'pagination.count': '200' },
	},
	{
		name: 'functions.get',
		endpoint: Functions.get as AnyEndpoint,
		respondWith: { data: { function: FUNCTION } },
		input: { functionId: 'fn_1' },
		method: 'GET',
		path: '/functions/fn_1',
	},
	{
		name: 'functions.listVersions',
		endpoint: Functions.listVersions as AnyEndpoint,
		respondWith: paginated([FUNCTION], 'versions'),
		input: { functionId: 'fn_1' },
		method: 'GET',
		path: '/functions/fn_1/versions',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'functions.getVersion',
		endpoint: Functions.getVersion as AnyEndpoint,
		respondWith: { data: { version: FUNCTION } },
		input: { functionId: 'fn_1', versionId: 'v_1' },
		method: 'GET',
		path: '/functions/fn_1/versions/v_1',
	},
	{
		name: 'functions.create',
		endpoint: Functions.create as AnyEndpoint,
		respondWith: { data: { function: FUNCTION } },
		input: {
			code: 'async function onTrack(event, settings) { return event }',
			displayName: 'Enrich orders',
			resourceType: 'DESTINATION',
		},
		method: 'POST',
		path: '/functions',
		body: {
			code: 'async function onTrack(event, settings) { return event }',
			displayName: 'Enrich orders',
			resourceType: 'DESTINATION',
		},
	},
	{
		name: 'functions.update',
		endpoint: Functions.update as AnyEndpoint,
		respondWith: { data: { function: FUNCTION } },
		input: { functionId: 'fn_1', description: 'Enriches order events' },
		method: 'PATCH',
		path: '/functions/fn_1',
		body: { description: 'Enriches order events' },
	},
	{
		name: 'functions.deploy',
		endpoint: Functions.deploy as AnyEndpoint,
		respondWith: { data: { functionDeployment: { status: 'SUCCESS' } } },
		input: { functionId: 'fn_1' },
		method: 'POST',
		path: '/functions/fn_1/deploy',
		body: undefined,
	},
	{
		name: 'functions.restoreVersion',
		endpoint: Functions.restoreVersion as AnyEndpoint,
		respondWith: { data: { version: FUNCTION } },
		input: { functionId: 'fn_1', versionId: 'v_1' },
		method: 'POST',
		path: '/functions/fn_1/versions',
		body: { versionId: 'v_1' },
	},
	{
		name: 'functions.delete',
		endpoint: Functions.remove as AnyEndpoint,
		respondWith: { data: { status: 'SUCCESS' } },
		input: { functionId: 'fn_1' },
		method: 'DELETE',
		path: '/functions/fn_1',
	},
	{
		name: 'catalog.listDestinations',
		endpoint: Catalog.listDestinations as AnyEndpoint,
		respondWith: paginated([DESTINATION_METADATA], 'destinationsCatalog'),
		input: {},
		method: 'GET',
		path: '/catalog/destinations',
		query: { 'pagination.count': '200' },
	},
	{
		name: 'catalog.getDestination',
		endpoint: Catalog.getDestination as AnyEndpoint,
		respondWith: { data: { destinationMetadata: DESTINATION_METADATA } },
		input: { destinationMetadataId: '5gPpjD6ikn' },
		method: 'GET',
		path: '/catalog/destinations/5gPpjD6ikn',
	},
	{
		name: 'catalog.listSources',
		endpoint: Catalog.listSources as AnyEndpoint,
		respondWith: paginated([SOURCE_METADATA], 'sourcesCatalog'),
		input: { count: 500 },
		method: 'GET',
		path: '/catalog/sources',
		query: { 'pagination.count': '500' },
	},
	{
		name: 'catalog.getSource',
		endpoint: Catalog.getSource as AnyEndpoint,
		respondWith: { data: { sourceMetadata: SOURCE_METADATA } },
		input: { sourceMetadataId: 'dZeHygTSD4' },
		method: 'GET',
		path: '/catalog/sources/dZeHygTSD4',
	},
	{
		name: 'regulations.list',
		endpoint: Regulations.list as AnyEndpoint,
		respondWith: paginated([], 'regulations'),
		input: {
			status: 'RUNNING',
			regulationTypes: ['DELETE_ONLY'],
		},
		method: 'GET',
		path: '/regulations',
		query: {
			status: 'RUNNING',
			regulationTypes: 'DELETE_ONLY',
			'pagination.count': '200',
		},
	},
	{
		name: 'regulations.create',
		endpoint: Regulations.create as AnyEndpoint,
		respondWith: { data: { regulateId: '1qJkfE1tpwvQcklImGksLN629wn' } },
		input: {
			regulationType: 'DELETE_ONLY',
			subjectType: 'USER_ID',
			subjectIds: ['user_123'],
		},
		method: 'POST',
		path: '/regulations',
		body: {
			regulationType: 'DELETE_ONLY',
			subjectType: 'USER_ID',
			subjectIds: ['user_123'],
		},
	},
	{
		name: 'regulations.get',
		endpoint: Regulations.get as AnyEndpoint,
		respondWith: {
			data: { regulation: { id: '1qJ', overallStatus: 'FINISHED' } },
		},
		input: { regulateId: '1qJ' },
		method: 'GET',
		path: '/regulations/1qJ',
	},
];

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	// Any call a test did not queue a response for throws, so a fixture
	// mismatch cannot reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

// Arrays serialize one query parameter per element, so a two-value
// regulationTypes filter cannot be asserted through the collapsed
// Object.fromEntries view; the single-value row pins the shape here and the
// two-value form gets its own test below.
describe.each(CASES)(
	'$name',
	({ endpoint, respondWith, input, method, path, query, body }) => {
		it(`sends ${method} ${path} with the token in the Authorization header`, async () => {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(respondWith), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);

			// The fake context only carries what the endpoints read (ctx.key).
			await endpoint({ key: TOKEN } as never, input as never);

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const parsed = new URL(url);
			expect(parsed.origin + parsed.pathname).toBe(
				`${SEGMENT_API_BASE}${path}`,
			);
			expect(init.method).toBe(method);
			expect(new Headers(init.headers).get('authorization')).toBe(
				`Bearer ${TOKEN}`,
			);
			expect(Object.fromEntries(parsed.searchParams)).toEqual(query ?? {});
			if (body === undefined) {
				expect(init.body).toBeUndefined();
			} else {
				expect(JSON.parse(String(init.body))).toEqual(body);
			}
		});
	},
);

describe('query serialization details', () => {
	it('repeats an array query value as one parameter per element', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(paginated([], 'regulations')), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await (Regulations.list as AnyEndpoint)(
			{ key: TOKEN } as never,
			{ regulationTypes: ['DELETE_ONLY', 'SUPPRESS_ONLY'] } as never,
		);

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain(
			'regulationTypes=DELETE_ONLY&regulationTypes=SUPPRESS_ONLY',
		);
	});

	it('omits an absent status filter rather than sending an empty value', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(paginated([], 'regulations')), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await (Regulations.list as AnyEndpoint)(
			{ key: TOKEN } as never,
			{} as never,
		);

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).not.toContain('status=');
	});

	it('percent-encodes a write key with reserved characters in the path', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ data: { status: 'SUCCESS' } }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await (Sources.removeWriteKey as AnyEndpoint)(
			{ key: TOKEN } as never,
			{ sourceId: 'qQ1', writeKey: 'a/b' } as never,
		);

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${SEGMENT_API_BASE}/sources/qQ1/writekey/a%2Fb`);
	});
});
