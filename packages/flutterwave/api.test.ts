import { request } from 'corsair/http';
import { makeFlutterwaveRequest } from './client';
import { flutterwaveRoutes } from './endpoints';
import type { FlutterwaveContext } from './index';
import { flutterwave, flutterwaveEndpointSchemas } from './index';

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
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as FlutterwaveContext;

describe('Flutterwave plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = flutterwave();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(53);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(53);
		expect(Object.keys(flutterwaveEndpointSchemas)).toHaveLength(53);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(flutterwaveEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});
});

describe('Flutterwave request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ status: 'success' });
	});

	it('sends Bearer Authorization header and forwards query on GET', async () => {
		await makeFlutterwaveRequest('/transactions', 'test-api-key', {
			method: 'GET',
			query: { page: 2 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.flutterwave.com/v3',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/transactions',
				query: { page: 2 },
			}),
		);
	});
});

describe('Flutterwave representative endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ status: 'success', message: 'ok' });
	});

	it('maps key operations to expected API routes', async () => {
		const plugin = flutterwave({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as any;

		await endpoints.paymentLinks.create(mockCtx, {
			tx_ref: 'tx-ref-1',
			amount: 1000,
			currency: 'NGN',
			redirect_url: 'https://example.com/redirect',
			customer: { email: 'user@example.com' },
		});

		await endpoints.transactions.get(mockCtx, { id: 1190701 });
		await endpoints.paymentPlans.cancel(mockCtx, { id: 3874 });
		await endpoints.subaccounts.delete(mockCtx, { id: 3319 });
		await endpoints.transactions.verifyByReference(mockCtx, {
			tx_ref: 'tx-ref-1',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ method: 'POST', url: '/payments' }),
				expect.objectContaining({
					method: 'GET',
					url: '/transactions/1190701/verify',
				}),
				expect.objectContaining({
					method: 'PUT',
					url: '/payment-plans/3874/cancel',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/subaccounts/3319',
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/transactions/verify_by_reference',
					query: { tx_ref: 'tx-ref-1' },
				}),
			]),
		);
	});

	it('routes list endpoints with pagination query parameters', async () => {
		const plugin = flutterwave({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as any;

		await endpoints.transactions.list(mockCtx, {
			from: '2020-01-01',
			to: '2020-01-31',
			page: 2,
		});
		await endpoints.beneficiaries.list(mockCtx, { page: 3 });
		await endpoints.settlements.list(mockCtx, { page: 4 });

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/transactions',
					query: { from: '2020-01-01', to: '2020-01-31', page: 2 },
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/beneficiaries',
					query: { page: 3 },
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/settlements',
					query: { page: 4 },
				}),
			]),
		);
	});

	it('maps every documented operation to a concrete HTTP request', async () => {
		const plugin = flutterwave({ key: 'test-api-key' });
		const endpointTree = plugin.endpoints as Record<string, unknown>;

		const endpointByPath = new Map<
			string,
			(ctx: unknown, input: unknown) => Promise<unknown>
		>();
		for (const [group, groupValue] of Object.entries(endpointTree)) {
			if (!groupValue || typeof groupValue !== 'object') continue;
			for (const [name, operation] of Object.entries(groupValue)) {
				if (typeof operation === 'function') {
					endpointByPath.set(
						`${group}.${name}`,
						operation as (ctx: unknown, input: unknown) => Promise<unknown>,
					);
				}
			}
		}

		for (const route of flutterwaveRoutes) {
			const operation = endpointByPath.get(`${route.group}.${route.name}`);
			expect(operation).toBeDefined();
			await operation!(mockCtx, route.testInput ?? {});
		}

		expect(mockRequest).toHaveBeenCalledTimes(flutterwaveRoutes.length);

		for (const route of flutterwaveRoutes) {
			const testInput = (route.testInput ?? {}) as Record<string, unknown>;
			const expectedUrl = route.path.replace(
				/\{([^}]+)\}/g,
				(_, key: string) => {
					const value = testInput[key];
					return encodeURIComponent(String(value));
				},
			);

			expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						method: route.method,
						url: expectedUrl,
					}),
				]),
			);
		}
	});

	it('enforces route-specific input schemas for provider-required fields', () => {
		const createBeneficiarySchema =
			flutterwaveEndpointSchemas['beneficiaries.create']?.input;
		const createBulkVirtualAccountsSchema =
			flutterwaveEndpointSchemas['bulkVirtualAccounts.create']?.input;
		const getBulkTokenizedChargeSchema =
			flutterwaveEndpointSchemas['bulkTokenizedCharges.get']?.input;

		expect(createBeneficiarySchema).toBeDefined();
		expect(createBulkVirtualAccountsSchema).toBeDefined();
		expect(getBulkTokenizedChargeSchema).toBeDefined();

		expect(
			createBeneficiarySchema!.safeParse({
				body: {
					account_number: '0690000040',
					account_bank: '044',
					beneficiary_name: 'Alexis Sanchez',
				},
			}).success,
		).toBe(true);
		expect(
			createBeneficiarySchema!.safeParse({
				account_number: '0690000040',
				account_bank: '044',
				beneficiary_name: 'Alexis Sanchez',
			}).success,
		).toBe(true);
		expect(createBeneficiarySchema!.safeParse({}).success).toBe(false);
		expect(
			createBeneficiarySchema!.safeParse({
				body: {
					account_number: '0690000040',
					bank_code: '044',
					full_name: 'Alexis Sanchez',
				},
			}).success,
		).toBe(false);

		expect(
			createBulkVirtualAccountsSchema!.safeParse({
				body: {
					batch_ref: 'batch-ref-1',
					bulk_data: [
						{
							firstname: 'Alexis',
							lastname: 'Sanchez',
							email: 'user@example.com',
							bvn: '12345678901',
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			createBulkVirtualAccountsSchema!.safeParse({
				batch_ref: 'batch-ref-1',
				bulk_data: [
					{
						firstname: 'Alexis',
						lastname: 'Sanchez',
						email: 'user@example.com',
						bvn: '12345678901',
					},
				],
			}).success,
		).toBe(true);
		expect(createBulkVirtualAccountsSchema!.safeParse({}).success).toBe(false);
		expect(
			createBulkVirtualAccountsSchema!.safeParse({
				body: {
					batch_ref: 'batch-ref-1',
					bulk_data: [{ email: 'user@example.com', tx_ref: 'tx-ref-1' }],
				},
			}).success,
		).toBe(false);

		expect(
			getBulkTokenizedChargeSchema!.safeParse({ bulk_id: 1001 }).success,
		).toBe(true);
		expect(
			getBulkTokenizedChargeSchema!.safeParse({ bulk_id: 'bulk-1' }).success,
		).toBe(false);
	});
});
