import { request } from 'corsair/http';
import {
	GoogleAnalyticsEndpointInputSchemas,
	GoogleAnalyticsEndpointOutputSchemas,
} from './endpoints/types';
import type { GoogleAnalyticsContext } from './index';
import { googleanalytics } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const ADMIN_BASE = 'https://analyticsadmin.googleapis.com';
const DATA_BASE = 'https://analyticsdata.googleapis.com';

// Endpoint handlers only read key, db, options, and $getAccountId at runtime;
// the full CorsairPluginContext carries runtime-bound members a hand-built
// literal cannot satisfy, so widen through unknown once here.
const mockCtx = {
	key: 'test-token',
	$getAccountId: async () => 'test-account-id',
	options: {},
	db: {},
} as unknown as GoogleAnalyticsContext;

// These tests pin down the schema contract without hitting the network:
// representative GA responses parse against the output schemas, and inputs
// accept the documented shapes (plus extra fields, since they are loose).

type RouteCase = {
	/** dot path in the nested endpoint tree, e.g. "reports.run" */
	endpoint: string;
	input: Record<string, unknown>;
	base: string;
	method: string;
	url: string;
};

// One case per endpoint (67 HTTP endpoints; the 2 Measurement Protocol
// endpoints use fetch and are covered separately below). Expected URLs come
// from the GA4 Admin API (v1alpha/v1beta) and Data API REST references.
const PROP = 'properties/100';
const routeCases: RouteCase[] = [
	// accounts (Admin API)
	{
		endpoint: 'accounts.get',
		input: { name: 'accounts/123' },
		base: ADMIN_BASE,
		method: 'GET',
		url: '/v1beta/accounts/123',
	},
	{
		endpoint: 'accounts.list',
		input: {},
		base: ADMIN_BASE,
		method: 'GET',
		url: '/v1alpha/accounts',
	},
	{
		endpoint: 'accounts.listV1Beta',
		input: {},
		base: ADMIN_BASE,
		method: 'GET',
		url: '/v1beta/accounts',
	},
	{
		endpoint: 'accounts.listSummaries',
		input: {},
		base: ADMIN_BASE,
		method: 'GET',
		url: '/v1beta/accountSummaries',
	},
	{
		endpoint: 'accounts.getDataSharingSettings',
		input: { name: 'accounts/123/dataSharingSettings' },
		base: ADMIN_BASE,
		method: 'GET',
		url: '/v1beta/accounts/123/dataSharingSettings',
	},
	{
		endpoint: 'accounts.provisionAccountTicket',
		input: { account: { displayName: 'A' } },
		base: ADMIN_BASE,
		method: 'POST',
		url: '/v1beta/accounts:provisionAccountTicket',
	},
	// properties (Admin API)
	{
		endpoint: 'properties.get',
		input: { name: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}`,
	},
	{
		endpoint: 'properties.list',
		input: {},
		base: ADMIN_BASE,
		method: 'GET',
		url: '/v1alpha/properties',
	},
	{
		endpoint: 'properties.listFiltered',
		input: { filter: 'parent:accounts/123' },
		base: ADMIN_BASE,
		method: 'GET',
		url: '/v1beta/properties',
	},
	{
		endpoint: 'properties.update',
		input: {
			property: { name: PROP, displayName: 'P' },
			updateMask: 'displayName',
		},
		base: ADMIN_BASE,
		method: 'PATCH',
		url: `/v1beta/${PROP}`,
	},
	{
		endpoint: 'properties.createRollup',
		input: { rollupProperty: { displayName: 'R' } },
		base: ADMIN_BASE,
		method: 'POST',
		url: '/v1alpha/properties:createRollupProperty',
	},
	{
		endpoint: 'properties.getAttributionSettings',
		input: { name: `${PROP}/attributionSettings` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/attributionSettings`,
	},
	{
		endpoint: 'properties.getDataRetentionSettings',
		input: { name: `${PROP}/dataRetentionSettings` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/dataRetentionSettings`,
	},
	{
		endpoint: 'properties.getGoogleSignalsSettings',
		input: { name: `${PROP}/googleSignalsSettings` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/googleSignalsSettings`,
	},
	// property quota snapshot lives on the Data API, v1alpha only
	{
		endpoint: 'properties.getPropertyQuotasSnapshot',
		input: { name: `${PROP}/propertyQuotasSnapshot` },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/propertyQuotasSnapshot`,
	},
	// custom dimensions / metrics (Admin API v1beta)
	{
		endpoint: 'customDimensions.create',
		input: { parent: PROP, customDimension: { parameterName: 'x' } },
		base: ADMIN_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}/customDimensions`,
	},
	{
		endpoint: 'customDimensions.get',
		input: { name: `${PROP}/customDimensions/1` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/customDimensions/1`,
	},
	{
		endpoint: 'customDimensions.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/customDimensions`,
	},
	{
		endpoint: 'customDimensions.archive',
		input: { name: `${PROP}/customDimensions/1` },
		base: ADMIN_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}/customDimensions/1:archive`,
	},
	{
		endpoint: 'customMetrics.create',
		input: { parent: PROP, customMetric: { parameterName: 'y' } },
		base: ADMIN_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}/customMetrics`,
	},
	{
		endpoint: 'customMetrics.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/customMetrics`,
	},
	// calculated metrics, key events, conversion events
	{
		endpoint: 'calculatedMetrics.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/calculatedMetrics`,
	},
	{
		endpoint: 'keyEvents.get',
		input: { name: `${PROP}/keyEvents/1` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/keyEvents/1`,
	},
	{
		endpoint: 'keyEvents.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/keyEvents`,
	},
	{
		endpoint: 'conversionEvents.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/conversionEvents`,
	},
	// audiences (Admin API v1alpha)
	{
		endpoint: 'audiences.get',
		input: { name: `${PROP}/audiences/1` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/audiences/1`,
	},
	{
		endpoint: 'audiences.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/audiences`,
	},
	// audience lists (Data API v1alpha)
	{
		endpoint: 'audienceLists.create',
		input: { parent: PROP, audienceList: {} },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1alpha/${PROP}/audienceLists`,
	},
	{
		endpoint: 'audienceLists.get',
		input: { name: `${PROP}/audienceLists/1` },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/audienceLists/1`,
	},
	{
		endpoint: 'audienceLists.list',
		input: { parent: PROP },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/audienceLists`,
	},
	{
		endpoint: 'audienceLists.query',
		input: { name: `${PROP}/audienceLists/1`, limit: 10 },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1alpha/${PROP}/audienceLists/1:query`,
	},
	// audience exports (Data API v1beta)
	{
		endpoint: 'audienceExports.create',
		input: { parent: PROP, audienceExport: {} },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}/audienceExports`,
	},
	{
		endpoint: 'audienceExports.get',
		input: { name: `${PROP}/audienceExports/1` },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/audienceExports/1`,
	},
	{
		endpoint: 'audienceExports.list',
		input: { parent: PROP },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/audienceExports`,
	},
	{
		endpoint: 'audienceExports.query',
		input: { name: `${PROP}/audienceExports/1`, limit: 10 },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}/audienceExports/1:query`,
	},
	// recurring audience lists (Data API v1alpha)
	{
		endpoint: 'recurringAudienceLists.create',
		input: { parent: PROP, recurringAudienceList: {} },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1alpha/${PROP}/recurringAudienceLists`,
	},
	{
		endpoint: 'recurringAudienceLists.get',
		input: { name: `${PROP}/recurringAudienceLists/1` },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/recurringAudienceLists/1`,
	},
	{
		endpoint: 'recurringAudienceLists.list',
		input: { parent: PROP },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/recurringAudienceLists`,
	},
	// data streams (Admin API)
	{
		endpoint: 'dataStreams.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/dataStreams`,
	},
	{
		endpoint: 'dataStreams.listMeasurementProtocolSecrets',
		input: { parent: `${PROP}/dataStreams/1` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/dataStreams/1/measurementProtocolSecrets`,
	},
	{
		endpoint: 'dataStreams.listEventCreateRules',
		input: { parent: `${PROP}/dataStreams/1` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/dataStreams/1/eventCreateRules`,
	},
	{
		endpoint: 'dataStreams.listSKAdNetworkConversionValueSchemas',
		input: { parent: `${PROP}/dataStreams/1` },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/dataStreams/1/sKAdNetworkConversionValueSchema`,
	},
	// product links (Admin API)
	{
		endpoint: 'links.listAdSense',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/adSenseLinks`,
	},
	{
		endpoint: 'links.listBigQuery',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/bigQueryLinks`,
	},
	{
		endpoint: 'links.listFirebase',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/firebaseLinks`,
	},
	{
		endpoint: 'links.listGoogleAds',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/googleAdsLinks`,
	},
	{
		endpoint: 'links.listDV360Advertiser',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/displayVideo360AdvertiserLinks`,
	},
	{
		endpoint: 'links.listDV360Proposals',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/displayVideo360AdvertiserLinkProposals`,
	},
	{
		endpoint: 'links.listSearchAds360',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/searchAds360Links`,
	},
	// expanded data sets / channel groups (Admin API v1alpha)
	{
		endpoint: 'expandedDataSets.create',
		input: { parent: PROP, expandedDataSet: {} },
		base: ADMIN_BASE,
		method: 'POST',
		url: `/v1alpha/${PROP}/expandedDataSets`,
	},
	{
		endpoint: 'expandedDataSets.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/expandedDataSets`,
	},
	{
		endpoint: 'channelGroups.list',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/channelGroups`,
	},
	// reporting data admin surfaces (Admin API v1alpha)
	{
		endpoint: 'reportingData.listAnnotations',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/reportingDataAnnotations`,
	},
	{
		endpoint: 'reportingData.listSubpropertyEventFilters',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/subpropertyEventFilters`,
	},
	{
		endpoint: 'reportingData.listSubpropertySyncConfigs',
		input: { parent: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/subpropertySyncConfigs`,
	},
	// reports (Data API; funnel is v1alpha-only)
	{
		endpoint: 'reports.run',
		input: { property: PROP },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}:runReport`,
	},
	{
		endpoint: 'reports.runRealtime',
		input: { property: PROP },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}:runRealtimeReport`,
	},
	{
		endpoint: 'reports.runPivot',
		input: { property: PROP },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}:runPivotReport`,
	},
	{
		endpoint: 'reports.runFunnel',
		input: { property: PROP },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1alpha/${PROP}:runFunnelReport`,
	},
	{
		endpoint: 'reports.batchRun',
		input: { property: PROP },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}:batchRunReports`,
	},
	{
		endpoint: 'reports.batchRunPivot',
		input: { property: PROP },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}:batchRunPivotReports`,
	},
	{
		endpoint: 'reports.checkCompatibility',
		input: { property: PROP },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1beta/${PROP}:checkCompatibility`,
	},
	{
		endpoint: 'reports.getMetadata',
		input: { name: `${PROP}/metadata` },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}/metadata`,
	},
	// report tasks (Data API v1alpha)
	{
		endpoint: 'reportTasks.create',
		input: { parent: PROP, reportTask: {} },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1alpha/${PROP}/reportTasks`,
	},
	{
		endpoint: 'reportTasks.get',
		input: { name: `${PROP}/reportTasks/1` },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/reportTasks/1`,
	},
	{
		endpoint: 'reportTasks.list',
		input: { parent: PROP },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/reportTasks`,
	},
	{
		endpoint: 'reportTasks.query',
		input: { name: `${PROP}/reportTasks/1`, limit: 10 },
		base: DATA_BASE,
		method: 'POST',
		url: `/v1alpha/${PROP}/reportTasks/1:query`,
	},
];

describe('endpoint routing hits the documented GA4 REST surface', () => {
	const plugin = googleanalytics({ key: 'test-token' });
	const endpoints = plugin.endpoints as unknown as Record<
		string,
		| Record<
				string,
				| ((
						ctx: GoogleAnalyticsContext,
						input: Record<string, unknown>,
				  ) => Promise<unknown>)
				| undefined
		  >
		| undefined
	>;

	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('covers every HTTP endpoint in the tree exactly once', () => {
		const leaves: string[] = [];
		for (const [group, groupEndpoints] of Object.entries(endpoints)) {
			for (const name of Object.keys(groupEndpoints ?? {})) {
				leaves.push(`${group}.${name}`);
			}
		}
		const covered = new Set(routeCases.map((c) => c.endpoint));
		const httpLeaves = leaves.filter(
			(leaf) => !leaf.startsWith('measurementProtocol.'),
		);
		expect(httpLeaves.filter((leaf) => !covered.has(leaf))).toEqual([]);
		expect([...covered].filter((leaf) => !httpLeaves.includes(leaf))).toEqual(
			[],
		);
	});

	it.each(routeCases)(
		'$endpoint → $method $url',
		async ({ endpoint, input, base, method, url }) => {
			const [group, name] = endpoint.split('.');
			const handler = endpoints[group ?? '']?.[name ?? ''];
			if (!handler) throw new Error(`[test] missing endpoint ${endpoint}`);

			await handler(mockCtx, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, options] = mockRequest.mock.calls[0] ?? [];
			expect(config.BASE).toBe(base);
			expect(options).toMatchObject({ method, url });
		},
	);

	it('propertiesUpdate forwards the updateMask as a query param', async () => {
		const handler = endpoints.properties?.update;
		if (!handler) throw new Error('[test] missing properties.update');
		await handler(mockCtx, {
			property: { name: PROP, displayName: 'P' },
			updateMask: 'displayName',
		});
		expect(mockRequest.mock.calls[0]?.[1].query).toEqual({
			updateMask: 'displayName',
		});
	});

	it('propertiesUpdate rejects a missing property.name instead of PATCHing /v1beta/undefined', async () => {
		const handler = endpoints.properties?.update;
		if (!handler) throw new Error('[test] missing properties.update');
		await expect(
			handler(mockCtx, { property: { displayName: 'No name' } }),
		).rejects.toThrow('propertiesUpdate requires property.name');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('propertiesUpdate normalizes a bare property id to properties/{id}', async () => {
		const handler = endpoints.properties?.update;
		if (!handler) throw new Error('[test] missing properties.update');
		await handler(mockCtx, { property: { name: '100', displayName: 'P' } });
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'PATCH',
			url: '/v1beta/properties/100',
		});
	});

	it('rejects endpoints longer than the URL bound before any request', async () => {
		const handler = endpoints.properties?.get;
		if (!handler) throw new Error('[test] missing properties.get');
		await expect(
			handler(mockCtx, { name: `properties/${'1'.repeat(4096)}` }),
		).rejects.toThrow(/exceeds 2048 characters/);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('measurement protocol routing (fetch-based)', () => {
	const plugin = googleanalytics({ key: 'test-token' });
	const endpoints = plugin.endpoints as unknown as {
		measurementProtocol: {
			sendEvents: (
				ctx: GoogleAnalyticsContext,
				input: Record<string, unknown>,
			) => Promise<unknown>;
			validateEvents: (
				ctx: GoogleAnalyticsContext,
				input: Record<string, unknown>,
			) => Promise<unknown>;
		};
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('sendEvents POSTs /mp/collect with the api secret and stream id as query params', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			status: 204,
			text: async () => '',
		} as unknown as Response);

		await endpoints.measurementProtocol.sendEvents(mockCtx, {
			apiSecret: 'secret',
			measurementId: 'G-XXXX',
			clientId: '555',
			events: [{ name: 'login' }],
		});

		const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(url.origin).toBe('https://www.google-analytics.com');
		expect(url.pathname).toBe('/mp/collect');
		expect(url.searchParams.get('api_secret')).toBe('secret');
		expect(url.searchParams.get('measurement_id')).toBe('G-XXXX');

		const body = JSON.parse(
			String(fetchMock.mock.calls[0]?.[1]?.body),
		) as Record<string, unknown>;
		expect(body.client_id).toBe('555');
		expect(body).not.toHaveProperty('apiSecret');
		expect(body).not.toHaveProperty('api_secret');
	});

	it('validateEvents POSTs the debug collect path', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			status: 200,
			text: async () => '{"validationMessages":[]}',
		} as unknown as Response);

		await endpoints.measurementProtocol.validateEvents(mockCtx, {
			apiSecret: 'secret',
			firebaseAppId: '1:123:web:abc',
			appInstanceId: 'abc',
			events: [{ name: 'login' }],
		});

		const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(url.pathname).toBe('/debug/mp/collect');
		expect(url.searchParams.get('firebase_app_id')).toBe('1:123:web:abc');
	});
});

describe('output schemas accept representative GA payloads', () => {
	it('accountsGet parses an account resource', () => {
		const parsed = GoogleAnalyticsEndpointOutputSchemas.accountsGet.parse({
			name: 'accounts/123',
			displayName: 'My Account',
			regionCode: 'US',
			countryCode: 'US',
			createTime: '2021-01-01T00:00:00Z',
			updateTime: '2021-06-01T00:00:00Z',
			deleted: false,
		});
		expect(parsed.name).toBe('accounts/123');
	});

	it('accountsList parses a list envelope', () => {
		const parsed = GoogleAnalyticsEndpointOutputSchemas.accountsList.parse({
			accounts: [{ name: 'accounts/1' }, { name: 'accounts/2' }],
			nextPageToken: 'token',
		});
		expect(parsed.accounts).toHaveLength(2);
		expect(parsed.nextPageToken).toBe('token');
	});

	it('propertiesList parses a list envelope', () => {
		const parsed = GoogleAnalyticsEndpointOutputSchemas.propertiesList.parse({
			properties: [{ name: 'properties/100', displayName: 'Web' }],
		});
		expect(parsed.properties).toHaveLength(1);
	});

	it('customDimensionsList parses a list envelope', () => {
		const parsed =
			GoogleAnalyticsEndpointOutputSchemas.customDimensionsList.parse({
				customDimensions: [{ name: 'properties/100/customDimensions/1' }],
				nextPageToken: undefined,
			});
		expect(parsed.customDimensions).toHaveLength(1);
	});

	it('reportsRun passes report rows through opaquely', () => {
		const parsed = GoogleAnalyticsEndpointOutputSchemas.reportsRun.parse({
			dimensionHeaders: [{ name: 'city' }],
			metricHeaders: [{ name: 'sessions', type: 'TYPE_INTEGER' }],
			rows: [
				{
					dimensionValues: [{ value: 'Austin' }],
					metricValues: [{ value: '42' }],
				},
			],
			totals: [],
			rowCount: 1,
			metadata: { currencyCode: 'USD', timezone: 'America/Chicago' },
		});
		expect((parsed as { rowCount: number }).rowCount).toBe(1);
	});

	it('keyEventsList parses a list envelope', () => {
		const parsed = GoogleAnalyticsEndpointOutputSchemas.keyEventsList.parse({
			keyEvents: [{ name: 'properties/100/keyEvents/1' }],
		});
		expect(parsed.keyEvents).toHaveLength(1);
	});
});

describe('input schemas accept documented shapes', () => {
	it('reportsRun accepts a full report request and extra fields', () => {
		const input = {
			property: 'properties/100',
			dateRanges: [{ startDate: '2024-01-01', endDate: '2024-01-31' }],
			dimensions: [{ name: 'city' }],
			metrics: [{ name: 'sessions' }],
			limit: 100,
			offset: 0,
			dimensionFilter: { andGroup: { expressions: [] } },
			keepEmptyRows: false,
			returnPropertyQuota: true,
			someFutureField: true,
		};
		const parsed = GoogleAnalyticsEndpointInputSchemas.reportsRun.parse(input);
		expect(parsed.property).toBe('properties/100');
	});

	it('propertiesListFiltered requires a filter', () => {
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.propertiesListFiltered.parse({
				pageSize: 50,
			}),
		).toThrow();
		const parsed =
			GoogleAnalyticsEndpointInputSchemas.propertiesListFiltered.parse({
				filter: 'accounts/123',
			});
		expect(parsed.filter).toBe('accounts/123');
	});

	it('parent-scoped lists accept the parent plus pagination', () => {
		const parsed = GoogleAnalyticsEndpointInputSchemas.audienceListsList.parse({
			parent: 'properties/100',
			pageSize: 200,
			pageToken: 'abc',
		});
		expect(parsed.parent).toBe('properties/100');
		expect(parsed.pageSize).toBe(200);
	});

	it('measurementProtocol events require an api secret, a stream id, and events', () => {
		// missing apiSecret
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents.parse({
				measurementId: 'G-XXXX',
				events: [{ name: 'login' }],
			}),
		).toThrow();
		// missing both stream identifiers (measurementId and firebaseAppId)
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents.parse({
				apiSecret: 'secret',
				events: [{ name: 'login' }],
			}),
		).toThrow();
		const parsed =
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents.parse({
				apiSecret: 'secret',
				measurementId: 'G-XXXX',
				clientId: '555',
				events: [{ name: 'login', params: { method: 'Google' } }],
			});
		expect(parsed.events[0]?.name).toBe('login');
	});
});
