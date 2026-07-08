import {
	GoogleAnalyticsEndpointInputSchemas,
	GoogleAnalyticsEndpointOutputSchemas,
} from './endpoints/types';

// These tests pin down the schema contract without hitting the network:
// representative GA responses parse against the output schemas, and inputs
// accept the documented shapes (plus extra fields, since they are loose).

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

	it('measurementProtocol events require an api secret and events', () => {
		expect(() =>
			GoogleAnalyticsEndpointInputSchemas.measurementProtocolSendEvents.parse({
				clientId: 'x',
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
