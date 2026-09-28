import { getOAuthAccessToken, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { encodeResourcePath, GoogleAnalyticsAPIError } from './client';
import {
	GoogleAnalyticsEndpointInputSchemas,
	GoogleAnalyticsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { GoogleAnalyticsContext } from './index';
import { googleanalytics } from './index';

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
		logEventFromContext: jest.fn(async () => null),
		getOAuthAccessToken: jest.fn(),
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

type RouteCase = {
	endpoint: string;
	input: Record<string, unknown>;
	base: string;
	method: string;
	url: string;
};

const PROP = 'properties/100';
const routeCases: RouteCase[] = [
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
	{
		endpoint: 'properties.get',
		input: { name: PROP },
		base: ADMIN_BASE,
		method: 'GET',
		url: `/v1beta/${PROP}`,
	},
	{
		endpoint: 'properties.list',
		input: { filter: 'parent:accounts/123' },
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
	{
		endpoint: 'properties.getPropertyQuotasSnapshot',
		input: { name: `${PROP}/propertyQuotasSnapshot` },
		base: DATA_BASE,
		method: 'GET',
		url: `/v1alpha/${PROP}/propertyQuotasSnapshot`,
	},
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

	it.each([
		[
			'customDimensions.create',
			{ parent: PROP, customDimension: { parameterName: 'x' } },
			{ parameterName: 'x' },
		],
		[
			'customMetrics.create',
			{ parent: PROP, customMetric: { parameterName: 'y' } },
			{ parameterName: 'y' },
		],
		[
			'expandedDataSets.create',
			{ parent: PROP, expandedDataSet: { displayName: 'set' } },
			{ displayName: 'set' },
		],
		[
			'audienceLists.create',
			{ parent: PROP, audienceList: { audience: `${PROP}/audiences/1` } },
			{ audience: `${PROP}/audiences/1` },
		],
		[
			'audienceExports.create',
			{ parent: PROP, audienceExport: { audience: `${PROP}/audiences/1` } },
			{ audience: `${PROP}/audiences/1` },
		],
		[
			'recurringAudienceLists.create',
			{
				parent: PROP,
				recurringAudienceList: { audience: `${PROP}/audiences/1` },
			},
			{ audience: `${PROP}/audiences/1` },
		],
		[
			'reportTasks.create',
			{ parent: PROP, reportTask: { reportDefinition: { limit: 10 } } },
			{ reportDefinition: { limit: 10 } },
		],
	] as const)(
		'%s posts the resource as the HTTP body',
		async (endpoint, input, expectedBody) => {
			const [group, name] = endpoint.split('.');
			const handler = endpoints[group ?? '']?.[name ?? ''];
			if (!handler) throw new Error(`[test] missing endpoint ${endpoint}`);

			await handler(mockCtx, { ...input });

			expect(mockRequest.mock.calls[0]?.[1].body).toEqual(expectedBody);
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
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockCtx,
			'googleanalytics.measurementProtocol.sendEvents',
			{ eventCount: 1, eventNames: ['login'] },
			'completed',
		);
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
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockCtx,
			'googleanalytics.measurementProtocol.validateEvents',
			{ eventCount: 1, eventNames: ['login'] },
			'completed',
		);
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

	it('propertiesList requires a filter', () => {
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.propertiesList.parse({
				pageSize: 50,
			}),
		).toThrow();
		const parsed = GoogleAnalyticsEndpointInputSchemas.propertiesList.parse({
			filter: 'accounts/123',
		});
		expect(parsed.filter).toBe('accounts/123');
	});

	it('propertiesListFiltered requires a filter', () => {
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.propertiesListFiltered.parse({
				pageSize: 50,
			}),
		).toThrow();
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.propertiesListFiltered.parse({
				filter: '',
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
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents.parse({
				measurementId: 'G-XXXX',
				events: [{ name: 'login' }],
			}),
		).toThrow();
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
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents.parse({
				apiSecret: 'secret',
				measurementId: 'G-XXXX',
				clientId: '555',
				events: [],
			}),
		).toThrow();
	});

	it('measurementProtocol web stream requires clientId alongside measurementId', () => {
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents.parse({
				apiSecret: 'secret',
				measurementId: 'G-XXXX',
				events: [{ name: 'login' }],
			}),
		).toThrow();
	});

	it('measurementProtocol Firebase app stream requires appInstanceId alongside firebaseAppId', () => {
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents.parse({
				apiSecret: 'secret',
				firebaseAppId: '1:123:web:abc',
				events: [{ name: 'login' }],
			}),
		).toThrow();
	});
});

describe('resource path encoding', () => {
	it('keeps hierarchical slashes and encodes query metacharacters', () => {
		expect(encodeResourcePath('accounts/123')).toBe('accounts/123');
		expect(encodeResourcePath('accounts/123?evil=1')).toBe(
			'accounts/123%3Fevil%3D1',
		);
	});

	it('rejects empty, dot, and parent segments', () => {
		expect(() => encodeResourcePath('accounts/../123')).toThrow(
			/invalid resource name/,
		);
		expect(() => encodeResourcePath('')).toThrow(/missing resource name/);
	});

	it('encodes injected query characters before the HTTP client runs', async () => {
		const plugin = googleanalytics({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as {
			accounts: {
				get: (
					ctx: GoogleAnalyticsContext,
					input: { name: string },
				) => Promise<unknown>;
			};
		};
		mockRequest.mockResolvedValue({ name: 'accounts/123' });
		await endpoints.accounts.get(mockCtx, {
			name: 'accounts/123?prettyPrint=true',
		});
		expect(mockRequest.mock.calls[0]?.[1].url).toBe(
			'/v1beta/accounts/123%3FprettyPrint%3Dtrue',
		);
	});
});

describe('plugin risk metadata', () => {
	it('treats listing measurement protocol secrets as a write', () => {
		const plugin = googleanalytics();
		expect(
			plugin.endpointMeta?.['dataStreams.listMeasurementProtocolSecrets'],
		).toEqual(
			expect.objectContaining({
				riskLevel: 'write',
			}),
		);
	});

	it('treats customDimensions.archive as destructive and irreversible', () => {
		const plugin = googleanalytics();
		expect(plugin.endpointMeta?.['customDimensions.archive']).toEqual(
			expect.objectContaining({
				riskLevel: 'destructive',
				irreversible: true,
			}),
		);
	});
});

describe('measurement protocol rate limits', () => {
	const plugin = googleanalytics({ key: 'test-token' });
	const endpoints = plugin.endpoints as unknown as {
		measurementProtocol: {
			sendEvents: (
				ctx: GoogleAnalyticsContext,
				input: Record<string, unknown>,
			) => Promise<unknown>;
		};
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('surfaces retry-after on 429 so the rate-limit handler can retry', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: false,
			status: 429,
			headers: {
				get: (name: string) =>
					name.toLowerCase() === 'retry-after' ? '2' : null,
			},
			text: async () => 'slow down',
		} as unknown as Response);

		const error = await endpoints.measurementProtocol
			.sendEvents(mockCtx, {
				apiSecret: 'secret',
				measurementId: 'G-XXXX',
				clientId: '555',
				events: [{ name: 'login' }],
			})
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(GoogleAnalyticsAPIError);
		const gaError = error as GoogleAnalyticsAPIError;
		expect(gaError.code).toBe(429);
		expect(gaError.retryAfter).toBe(2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(gaError)).toBe(true);
		const handled = await errorHandlers.RATE_LIMIT_ERROR.handler(gaError);
		expect(handled).toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});
});

describe('keyBuilder', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('uses shared oauth access instead of a plugin-local refresher', async () => {
		const mockGetToken = getOAuthAccessToken as jest.MockedFunction<
			typeof getOAuthAccessToken
		>;
		mockGetToken.mockResolvedValue('hub-token');

		const plugin = googleanalytics();
		const ctx = {
			authType: 'oauth_2' as const,
			tenantId: 'tenant-1',
			keys: {},
		};

		await expect(plugin.keyBuilder?.(ctx as never, 'endpoint')).resolves.toBe(
			'hub-token',
		);
		expect(mockGetToken).toHaveBeenCalledWith(ctx, {
			plugin: 'googleanalytics',
			tokenUrl: 'https://oauth2.googleapis.com/token',
		});
	});
});
