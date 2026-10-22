import { request } from 'corsair/http';
import * as endpointGroups from './endpoints';
import { Networks, UnblockRequests } from './endpoints';
import type { DnsfilterContext } from './index';

jest.mock('corsair/http', () => {
	class MockApiError extends Error {}
	return { request: jest.fn(), ApiError: MockApiError };
});

const requestMock = request as unknown as jest.Mock;

type EndpointFn = (ctx: DnsfilterContext, input: unknown) => Promise<unknown>;

function collectEndpoints(): Array<[string, EndpointFn]> {
	const endpoints: Array<[string, EndpointFn]> = [];
	for (const [groupName, group] of Object.entries(endpointGroups)) {
		if (typeof group !== 'object' || group === null) continue;
		for (const [name, value] of Object.entries(group)) {
			if (typeof value === 'function') {
				endpoints.push([`${groupName}.${name}`, value as EndpointFn]);
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
		body?: Record<string, unknown>;
	};
}

const endpoints = collectEndpoints();

describe('DNSFilter endpoint surface', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		requestMock.mockResolvedValue({ data: [] });
	});

	it('exposes all 248 JSON operations from the public spec', () => {
		expect(endpoints).toHaveLength(248);
		expect(Networks.networksGet).toBeDefined();
		expect(UnblockRequests.unblockRequestsDecision).toBeDefined();
	});

	it('issues a request for every operation with a versioned path', async () => {
		const ctx = createContext();

		for (const [, endpoint] of endpoints) {
			await endpoint(ctx, {});
		}

		expect(requestMock).toHaveBeenCalledTimes(endpoints.length);
		for (const [, options] of requestMock.mock.calls) {
			expect(options.url).toMatch(/^\/v[12]\//);
			expect(options.method).toMatch(/^(GET|POST|PATCH|PUT|DELETE)$/);
		}
	});

	it('passes path parameters for detail reads', async () => {
		await Networks.networksGet(createContext(), { id: 42 });

		const options = lastRequestOptions();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/v1/networks/{id}');
		expect(options.path).toEqual({ id: 42 });
	});

	it('passes create bodies through unchanged', async () => {
		await Networks.networksCreate(createContext(), {
			network: { name: 'HQ', organization_id: 7 },
		});

		const options = lastRequestOptions();
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/v1/networks');
		expect(options.body).toEqual({
			network: { name: 'HQ', organization_id: 7 },
		});
	});

	it('uses DELETE for destructive operations', async () => {
		await Networks.networksDelete(createContext(), { id: 9 });

		const options = lastRequestOptions();
		expect(options.method).toBe('DELETE');
		expect(options.path).toEqual({ id: 9 });
	});

	it('forwards nested pagination and filters as query values', async () => {
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
				attributes: { name: 'HQ', created_at: '2026-01-02T03:04:05Z' },
			},
		});

		await Networks.networksGet(ctx, { id: 7 });

		expect(upsertByEntityId).toHaveBeenCalledWith(
			'7',
			expect.objectContaining({
				id: '7',
				name: 'HQ',
				createdAt: new Date('2026-01-02T03:04:05Z'),
			}),
		);
	});

	it('logs an event for every call', async () => {
		const ctx = createContext();
		await Networks.networksList(ctx, {});
		expect(ctx.$getAccountId).toHaveBeenCalled();
	});
});
