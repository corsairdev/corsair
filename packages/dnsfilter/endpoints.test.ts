import { request } from 'corsair/http';
import { z } from 'zod';
import * as endpointGroups from './endpoints';
import {
	CollectionUsers,
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

jest.mock('corsair/http', () => {
	class MockApiError extends Error {}
	return { request: jest.fn(), ApiError: MockApiError };
});

const requestMock = request as unknown as jest.Mock;

type EndpointFn = (ctx: DnsfilterContext, input: unknown) => Promise<unknown>;
type EndpointKey = keyof typeof DnsfilterEndpointInputSchemas;

function collectEndpoints(): Array<[EndpointKey, EndpointFn]> {
	const endpoints: Array<[EndpointKey, EndpointFn]> = [];
	for (const group of Object.values(endpointGroups)) {
		if (typeof group !== 'object' || group === null) continue;
		for (const [name, value] of Object.entries(group)) {
			if (typeof value === 'function') {
				endpoints.push([name as EndpointKey, value as EndpointFn]);
			}
		}
	}
	return endpoints;
}

function createContext(db: Record<string, unknown> = {}): DnsfilterContext {
	return {
		key: 'test-key',
		$getAccountId: jest.fn(async () => 'account-1'),
		database: undefined,
		db,
	} as unknown as DnsfilterContext;
}

function lastRequestOptions() {
	const calls = requestMock.mock.calls;
	return calls[calls.length - 1][1] as {
		method: string;
		url: string;
		path?: Record<string, unknown>;
		query?: Record<string, unknown>;
		body?: unknown;
	};
}

/** First candidate that satisfies the operation's response schema. */
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

const endpoints = collectEndpoints();

describe('DNSFilter endpoint surface', () => {
	beforeEach(() => {
		requestMock.mockReset();
		requestMock.mockResolvedValue({ data: [] });
	});

	it('exposes all 248 JSON operations from the public spec', () => {
		expect(endpoints).toHaveLength(248);
		expect(Networks.networksGet).toBeDefined();
		expect(UnblockRequests.unblockRequestsDecision).toBeDefined();
	});

	it('validates input and output for every operation', async () => {
		const ctx = createContext();
		let requestCount = 0;
		let validationCount = 0;

		for (const [key, endpoint] of endpoints) {
			const inputSchema = DnsfilterEndpointInputSchemas[key];
			if (!inputSchema.safeParse({}).success) {
				await expect(endpoint(ctx, {})).rejects.toBeInstanceOf(z.ZodError);
				validationCount += 1;
				continue;
			}
			requestMock.mockResolvedValueOnce(sampleOutput(key));
			await endpoint(ctx, {});
			requestCount += 1;
		}

		expect(validationCount).toBeGreaterThan(0);
		expect(requestCount).toBeGreaterThan(0);
		for (const [, options] of requestMock.mock.calls) {
			expect(options.url).toMatch(/^\/v[12]\//);
			expect(options.method).toMatch(/^(GET|POST|PATCH|PUT|DELETE)$/);
		}
	});

	it('rejects input that does not satisfy the operation schema', async () => {
		await expect(
			Networks.networksGet(createContext(), {} as never),
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
