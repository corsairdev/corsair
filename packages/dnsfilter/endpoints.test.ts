import { request } from 'corsair/http';
import { z } from 'zod';
import * as endpointGroups from './endpoints';
import {
	CollectionUsers,
	CsvExports,
	IpAddresses,
	Networks,
	TrafficReports,
	UnblockRequests,
} from './endpoints';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './endpoints/types';
import type { DnsfilterContext } from './index';
import {
	persistIpAddresses,
	persistNetworks,
	persistScheduledReports,
	persistUnblockRequests,
	persistUsers,
} from './persistence';

jest.mock('corsair/http', () => {
	class MockApiError extends Error {}
	return { request: jest.fn(), ApiError: MockApiError };
});

const requestMock = jest.mocked(request);

type EndpointFn = (ctx: DnsfilterContext, input: unknown) => Promise<unknown>;
type EndpointKey = keyof typeof DnsfilterEndpointInputSchemas;

function isEndpointKey(name: string): name is EndpointKey {
	return Object.hasOwn(DnsfilterEndpointInputSchemas, name);
}

function isEndpointFn(value: unknown): value is EndpointFn {
	return typeof value === 'function';
}

function collectEndpoints(): Map<EndpointKey, EndpointFn> {
	const endpoints = new Map<EndpointKey, EndpointFn>();
	for (const group of Object.values(endpointGroups)) {
		if (typeof group !== 'object' || group === null) continue;
		for (const [name, value] of Object.entries(group)) {
			if (isEndpointKey(name) && isEndpointFn(value)) {
				endpoints.set(name, value);
			}
		}
	}
	return endpoints;
}

const endpoints = collectEndpoints();
const endpointKeys = [...endpoints.keys()].sort();

function createContext(db: Record<string, unknown> = {}): DnsfilterContext {
	// Test double: only the fields the endpoints touch are provided, so the
	// cast stands in for the full Corsair context.
	return {
		key: 'test-key',
		$getAccountId: jest.fn(async () => 'account-1'),
		database: undefined,
		db,
	} as unknown as DnsfilterContext;
}

function lastRequestOptions() {
	const calls = requestMock.mock.calls;
	const options = calls[calls.length - 1]?.[1];
	if (!options) throw new Error('expected the endpoint to call request');
	return options;
}

/** First response shape the output schema accepts. */
function sampleOutput(key: EndpointKey): unknown {
	const schema = DnsfilterEndpointOutputSchemas[key];
	const candidates = [
		undefined,
		{},
		{ data: [] },
		{ data: {} },
		[],
		'',
		'value',
		0,
		null,
	];
	for (const candidate of candidates) {
		if (schema.safeParse(candidate).success) return candidate;
	}
	return undefined;
}

describe('DNSFilter endpoint surface', () => {
	beforeEach(() => {
		requestMock.mockReset();
		requestMock.mockResolvedValue({ data: [] });
	});

	it('exposes all 259 operations across 47 resource groups', () => {
		const groups = Object.values(endpointGroups).filter(
			(value) =>
				typeof value === 'object' &&
				value !== null &&
				Object.values(value).every((entry) => typeof entry === 'function'),
		);

		expect(endpoints.size).toBe(259);
		expect(groups).toHaveLength(47);
		expect(Networks.networksGet).toBeDefined();
		expect(UnblockRequests.unblockRequestsDecision).toBeDefined();
		expect(CsvExports.csvExportsUserAgentsCsv).toBeDefined();
	});
});

// One case per endpoint: bad input fails before the request, valid input hits
// the mocked transport and parses the response.
describe.each(endpointKeys)('endpoint %s', (key) => {
	beforeEach(() => {
		requestMock.mockReset();
		requestMock.mockResolvedValue({ data: [] });
	});

	it('validates input, calls the API, and parses the response', async () => {
		const endpoint = endpoints.get(key);
		const inputSchema = DnsfilterEndpointInputSchemas[key];
		const outputSchema = DnsfilterEndpointOutputSchemas[key];

		expect(endpoint).toBeDefined();
		expect(inputSchema).toBeDefined();
		expect(outputSchema).toBeDefined();

		if (!inputSchema.safeParse({}).success) {
			await expect(endpoint?.(createContext(), {})).rejects.toBeInstanceOf(
				z.ZodError,
			);
			expect(requestMock).not.toHaveBeenCalled();
			return;
		}

		requestMock.mockResolvedValueOnce(sampleOutput(key));
		const result = await endpoint?.(createContext(), {});

		expect(requestMock).toHaveBeenCalledTimes(1);
		const options = lastRequestOptions();
		expect(options.url).toMatch(/^\/v[12]\//);
		expect(options.method).toMatch(/^(GET|POST|PATCH|PUT|DELETE)$/);
		expect(outputSchema.safeParse(result).success).toBe(true);
	});
});

describe('DNSFilter request wiring', () => {
	beforeEach(() => {
		requestMock.mockReset();
		requestMock.mockResolvedValue({ data: [] });
	});

	it('rejects input that does not satisfy the operation schema', async () => {
		await expect(
			// @ts-expect-error - deliberately incomplete input, rejected at runtime.
			Networks.networksGet(createContext(), {}),
		).rejects.toBeInstanceOf(z.ZodError);
		expect(requestMock).not.toHaveBeenCalled();
	});

	it('passes path parameters for detail reads', async () => {
		requestMock.mockResolvedValueOnce({ data: {} });
		await Networks.networksGet(createContext(), { id: 42 });

		const options = lastRequestOptions();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/v1/networks/{id}');
		expect(options.path).toEqual({ id: 42 });
	});

	it('passes create bodies through unchanged', async () => {
		requestMock.mockResolvedValueOnce({ data: {} });
		await Networks.networksCreate(createContext(), {
			network: { name: 'HQ', organization_id: 7 },
		});

		const options = lastRequestOptions();
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/v1/networks');
		expect(options.body).toEqual({
			network: expect.objectContaining({ name: 'HQ' }),
		});
	});

	it('sends a colliding request body without extra nesting', async () => {
		requestMock.mockResolvedValueOnce(sampleOutput('collectionUsersCreate'));

		await CollectionUsers.collectionUsersCreate(createContext(), {
			collection_id: 12,
			body: { collection_id: 12, id: 34 },
		});

		const options = lastRequestOptions();
		expect(options.method).toBe('POST');
		expect(options.path).toEqual({ collection_id: 12 });
		expect(options.body).toEqual({ collection_id: 12, id: 34 });
	});

	it('uses DELETE and evicts the synced row', async () => {
		const deleteByEntityId = jest.fn();
		const ctx = createContext({ networks: { deleteByEntityId } });
		requestMock.mockResolvedValueOnce(undefined);

		await Networks.networksDelete(ctx, { id: 9 });

		const options = lastRequestOptions();
		expect(options.method).toBe('DELETE');
		expect(options.path).toEqual({ id: 9 });
		expect(deleteByEntityId).toHaveBeenCalledWith('9');
	});

	it('sends the document-misflagged GET body as query parameters', async () => {
		requestMock.mockResolvedValueOnce({ status: 'ok' });

		await IpAddresses.ipAddressesVerify(createContext(), {
			ip_address: {
				address: '203.0.113.7',
				organization_id: 1,
				network_id: 2,
			},
		});

		const options = lastRequestOptions();
		expect(options.method).toBe('GET');
		expect(options.body).toBeUndefined();
		expect(options.query).toHaveProperty('ip_address');
	});

	it('keeps IP verification rows in the parsed response', async () => {
		requestMock.mockResolvedValueOnce({
			data: [
				{
					id: 'ip-1',
					type: 'ip_addresses',
					attributes: { address: '203.0.113.7', organization_id: 1 },
				},
			],
		});

		const result = await IpAddresses.ipAddressesVerify(createContext(), {
			ip_address: {
				address: '203.0.113.7',
				organization_id: 1,
				network_id: 2,
			},
		});

		expect(result.data).toEqual([
			expect.objectContaining({
				id: 'ip-1',
				attributes: expect.objectContaining({ address: '203.0.113.7' }),
			}),
		]);
	});

	it('round-trips query-log cursor pagination', async () => {
		const page = { cursor: 'next-page', cursor_offset: 20, size: 20 };
		requestMock.mockResolvedValueOnce({
			data: { values: [], page },
		});

		const result = await TrafficReports.trafficReportsQueryLogs(
			createContext(),
			{ page },
		);

		expect(lastRequestOptions().query).toMatchObject({ page });
		expect(result.data?.page).toEqual(page);
	});

	it('forwards nested pagination and filters as query values', async () => {
		requestMock.mockResolvedValueOnce({ data: [] });
		await Networks.networksList(createContext(), {
			page: { number: 2, size: 25 },
			search: 'branch',
			protected: true,
		});

		const options = lastRequestOptions();
		expect(options.query).toMatchObject({
			page: { number: 2, size: 25 },
			search: 'branch',
			protected: true,
		});
	});

	it('persists JSON:API rows returned by an endpoint', async () => {
		const upsertByEntityId = jest.fn();
		const ctx = createContext({ networks: { upsertByEntityId } });
		requestMock.mockResolvedValueOnce({
			data: {
				id: '7',
				type: 'networks',
				attributes: { name: 'HQ' },
			},
		});

		await Networks.networksGet(ctx, { id: 7 });

		expect(upsertByEntityId).toHaveBeenCalledWith(
			'7',
			expect.objectContaining({ id: '7', name: 'HQ' }),
		);
	});

	it('logs an event for every call', async () => {
		const ctx = createContext();
		requestMock.mockResolvedValueOnce({ data: [] });
		await Networks.networksList(ctx, {});
		expect(ctx.$getAccountId).toHaveBeenCalled();
	});
});

describe('DNSFilter CSV exports', () => {
	beforeEach(() => {
		requestMock.mockReset();
	});

	it('downloads the user agents CSV as raw text', async () => {
		requestMock.mockResolvedValueOnce('organization,user_agents\nAcme,2');

		const result = await CsvExports.csvExportsUserAgentsCsv(createContext(), {
			organization_id: 7,
			include_suborgs: true,
			timezone: 'America/New_York',
		});

		const options = lastRequestOptions();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/v1/user_agents/csv');
		expect(options.query).toEqual({
			organization_id: 7,
			include_suborgs: true,
			timezone: 'America/New_York',
		});
		expect(result).toBe('organization,user_agents\nAcme,2');
	});

	it('creates a user agent export from the documented body', async () => {
		requestMock.mockResolvedValueOnce({ data: { id: 12 } });

		const result = await CsvExports.csvExportsUserAgentCreate(createContext(), {
			user_agent_csv_export: { organization_ids: [7], msp_id: 1 },
			type: 'agents',
			agent_state: 'protected',
			traffic_received_last_15_mins: true,
		});

		const options = lastRequestOptions();
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/v1/user_agent_csv_exports');
		expect(options.body).toMatchObject({
			user_agent_csv_export: { organization_ids: [7], msp_id: 1 },
			type: 'agents',
			agent_state: 'protected',
		});
		expect(result.data?.id).toBe(12);
	});

	it('splits network export filters from the nested body', async () => {
		requestMock.mockResolvedValueOnce({ data: { id: 3 } });

		await CsvExports.csvExportsNetworksCreate(createContext(), {
			search: 'branch',
			protected: true,
			networks_csv_export: { organization_ids: [7], ids: [1, 2] },
		});

		const options = lastRequestOptions();
		expect(options.query).toEqual({ search: 'branch', protected: true });
		expect(options.body).toEqual({
			networks_csv_export: { organization_ids: [7], ids: [1, 2] },
		});
	});

	it('requires the CyberSight report window and forwards columns', async () => {
		await expect(
			// @ts-expect-error - deliberately missing the report window.
			CsvExports.csvExportsCyberSightCreate(createContext(), {
				report_type: 'top_websites',
			}),
		).rejects.toBeInstanceOf(z.ZodError);
		expect(requestMock).not.toHaveBeenCalled();

		requestMock.mockResolvedValueOnce({
			data: { uuid: 'export-1', url: null },
		});
		await CsvExports.csvExportsCyberSightCreate(createContext(), {
			report_type: 'top_websites',
			start_at: '2026-01-01T00:00:00Z',
			end_at: '2026-01-31T00:00:00Z',
			included_columns: ['organization_name'],
			cyber_sight_csv_export: { included_columns: ['web_host'] },
		});

		const options = lastRequestOptions();
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/v2/cyber_sight/csv_exports/create');
		expect(options.query).toEqual({
			end_at: '2026-01-31T00:00:00Z',
			included_columns: ['organization_name'],
			report_type: 'top_websites',
			start_at: '2026-01-01T00:00:00Z',
		});
		expect(options.body).toMatchObject({
			report_type: 'top_websites',
			cyber_sight_csv_export: { included_columns: ['web_host'] },
		});
		// The column list travels as a query parameter, not duplicated in the body.
		expect(options.body).not.toHaveProperty('included_columns');
	});

	it('accepts the pending shape while polling an unblock export', async () => {
		requestMock.mockResolvedValueOnce({
			export: { uuid: 'export-2', status: 'processing' },
		});

		const result = await CsvExports.csvExportsUnblockRequestsGet(
			createContext(),
			{ id: 'export-2' },
		);

		const options = lastRequestOptions();
		expect(options.url).toBe('/v2/unblock_requests_csv_export/{id}');
		expect(options.path).toEqual({ id: 'export-2' });
		expect(result.export).toMatchObject({ status: 'processing' });
	});
});

function entityClient() {
	return { upsertByEntityId: jest.fn() };
}

describe('DNSFilter persistence', () => {
	it('persists list responses', async () => {
		const networks = entityClient();
		const ctx = createContext({ networks });

		await persistNetworks(ctx, {
			data: [
				{
					id: 1,
					attributes: { name: 'HQ', organization_id: 5 },
					relationships: { policy: { data: { id: 12 } } },
				},
				{ id: '2', attributes: { name: 'Branch' } },
			],
		});

		expect(networks.upsertByEntityId).toHaveBeenCalledTimes(2);
		expect(networks.upsertByEntityId).toHaveBeenNthCalledWith(
			1,
			'1',
			expect.objectContaining({
				id: '1',
				name: 'HQ',
				policyId: '12',
			}),
		);
		expect(networks.upsertByEntityId).toHaveBeenNthCalledWith(
			2,
			'2',
			expect.objectContaining({ id: '2', name: 'Branch' }),
		);
	});

	it('reads user attributes and emails', async () => {
		const users = entityClient();
		const ctx = createContext({ users });

		await persistUsers(ctx, {
			data: {
				id: 'u-1',
				attributes: {
					name: 'Ada Lovelace',
					email: 'ada@example.com',
					role: 'admin',
				},
			},
		});

		expect(users.upsertByEntityId).toHaveBeenCalledWith(
			'u-1',
			expect.objectContaining({
				email: 'ada@example.com',
				role: 'admin',
			}),
		);
	});

	it('persists IP addresses using the ip attribute', async () => {
		const ipAddresses = entityClient();
		const ctx = createContext({ ipAddresses });

		await persistIpAddresses(ctx, {
			data: { id: 'ip-1', attributes: { ip: '203.0.113.10' } },
		});

		expect(ipAddresses.upsertByEntityId).toHaveBeenCalledWith(
			'ip-1',
			expect.objectContaining({ address: '203.0.113.10' }),
		);
	});

	it('persists unblock requests with their status', async () => {
		const unblockRequests = entityClient();
		const ctx = createContext({ unblockRequests });

		await persistUnblockRequests(ctx, {
			data: {
				id: 'req-1',
				attributes: { domain: 'example.com', status: 'pending' },
			},
		});

		expect(unblockRequests.upsertByEntityId).toHaveBeenCalledWith(
			'req-1',
			expect.objectContaining({ domain: 'example.com', status: 'pending' }),
		);
	});

	it('maps the DNSFilter frequency field on scheduled reports', async () => {
		const scheduledReports = entityClient();
		const ctx = createContext({ scheduledReports });

		await persistScheduledReports(ctx, {
			data: {
				id: 'report-1',
				attributes: {
					name: 'Weekly',
					frequency: 'weekly',
					organization_id: 12,
				},
			},
		});

		expect(scheduledReports.upsertByEntityId).toHaveBeenCalledWith(
			'report-1',
			expect.objectContaining({
				name: 'Weekly',
				frequency: 'weekly',
				organizationId: '12',
			}),
		);
	});

	it('never throws when the database write fails', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const networks = {
			upsertByEntityId: jest.fn(async () => {
				throw new Error('database offline');
			}),
		};
		const ctx = createContext({ networks });

		await expect(
			persistNetworks(ctx, { data: { id: 1, attributes: { name: 'HQ' } } }),
		).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});
