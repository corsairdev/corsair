import { ApiError, request } from 'corsair/http';
import { makeBooqableRequest } from './client';
import type { BooqableContext } from './index';
import { booqable, booqableEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {
		companySlug: 'demo-company',
	},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('test-api-key'),
		get_tenant_external_id: jest.fn().mockResolvedValue('demo-company'),
	},
	logEvent: jest.fn(),
	db: {},
} as unknown as BooqableContext;

describe('Booqable plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = booqable();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(49);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(49);
		expect(Object.keys(booqableEndpointSchemas)).toHaveLength(49);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(booqableEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('uses api_key auth with tenant_external_id account field', () => {
		const plugin = booqable();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

describe('Booqable request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ data: [] });
	});

	it('sends bearer auth to the company-scoped base URL', async () => {
		await makeBooqableRequest('/customers', 'test-api-key', 'demo-company', {
			method: 'GET',
			query: { 'page[number]': 1, 'page[size]': 25 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://demo-company.booqable.com/api/4',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/customers',
				query: { 'page[number]': 1, 'page[size]': 25 },
			}),
		);
	});

	it('preserves ApiError metadata when wrapping failures', async () => {
		const apiError = new ApiError(
			{ url: '/customers', method: 'GET' },
			{
				url: '/customers',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'rate limited',
			{ retryAfter: 1500 },
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeBooqableRequest('/customers', 'test-api-key', 'demo-company'),
		).rejects.toMatchObject({
			name: 'BooqableAPIError',
			status: 429,
			retryAfter: 1500,
		});
	});
});

describe('Booqable endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ data: [] });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = booqable({
			companySlug: 'demo-company',
			key: 'test-api-key',
		});
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		await endpoints.customers.getCustomers(mockCtx, {
			query: { 'page[number]': 1 },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({
				BASE: 'https://demo-company.booqable.com/api/4',
			}),
			expect.objectContaining({ method: 'GET', url: '/customers' }),
		);

		await endpoints.customers.createCustomer(mockCtx, {
			body: { data: { type: 'customers', attributes: { name: 'Jane' } } },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/customers',
				body: { data: { type: 'customers', attributes: { name: 'Jane' } } },
			}),
		);

		await endpoints.orders.searchOrders(mockCtx, {
			body: { filter: { status: 'reserved' } },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'POST', url: '/orders/search' }),
		);

		await endpoints.customers.getCustomer(mockCtx, { id: 'cust-1' });
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: '/customers/cust-1' }),
		);
	});
});
