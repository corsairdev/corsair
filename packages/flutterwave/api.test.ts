import { AuthMissingError } from 'corsair/core';
import { request } from 'corsair/http';
import { makeFlutterwaveRequest } from './client';
import { flutterwaveRoutes } from './endpoints';
import type {
	FlutterwaveHandlerContext,
	FlutterwaveKeyBuilderContext,
} from './index';
import { flutterwave, flutterwaveEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(
	// unknown is necessary because the endpoint tree mixes functions and nested groups; a closed node union is infeasible because the tree is generated from 53 operations
	tree: Record<string, unknown>,
): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(
	// unknown is necessary because path walkers receive the same mixed endpoint tree; a closed node union is infeasible because groups nest arbitrarily
	tree: Record<string, unknown>,
	prefix = '',
): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx: FlutterwaveHandlerContext = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account-id',
};

const paymentLinkInput = {
	tx_ref: 'tx-ref-1',
	amount: 1000,
	currency: 'NGN',
	redirect_url: 'https://example.com/redirect',
	customer: { email: 'user@example.com' },
};

const tanzaniaChargeInput = {
	type: 'mobile_money_tanzania',
	tx_ref: 'tx-ref-1',
	amount: 1000,
	currency: 'TZS',
	email: 'user@example.com',
	phone_number: '255700000001',
};

describe('Flutterwave plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = flutterwave();
		const endpoints = plugin.endpoints as Record<string, unknown>; // unknown is necessary because the plugin tree is a nested object of functions; a closed group union is infeasible in this walker
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(53);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(53);
		expect(Object.keys(flutterwaveEndpointSchemas)).toHaveLength(53);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(flutterwaveEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('throws AuthMissingError when no API key is configured', async () => {
		const plugin = flutterwave();
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		const ctx: FlutterwaveKeyBuilderContext = {
			authType: 'api_key',
			options: {},
			tenantId: 'tenant-1',
			keys: {
				get_api_key: async () => null,
				set_api_key: async () => undefined,
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => undefined,
				get_dek: async () => 'dek',
				issue_new_dek: async () => 'dek',
			},
		};
		await expect(keyBuilder!(ctx, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
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
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 3,
				}),
			}),
		);
	});

	it('does not enable transport retries on write charges', async () => {
		await makeFlutterwaveRequest('/charges', 'test-api-key', {
			method: 'POST',
			body: tanzaniaChargeInput,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'POST', url: '/charges' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: false,
					maxRetries: 0,
				}),
			}),
		);
	});

	it('rejects envelopes that fail the Flutterwave response schema', async () => {
		mockRequest.mockResolvedValueOnce({ unexpected: true });
		await expect(
			makeFlutterwaveRequest('/transactions/1/verify', 'test-api-key', {
				method: 'GET',
			}),
		).rejects.toThrow(/Flutterwave/);
	});
});

describe('Flutterwave representative endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ status: 'success', message: 'ok' });
	});

	it('maps key operations to expected API routes', async () => {
		const plugin = flutterwave({ key: 'test-api-key' });
		const endpoints = plugin.endpoints!;

		await endpoints.paymentLinks.create(mockCtx, paymentLinkInput);
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
		const endpoints = plugin.endpoints!;

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
		// unknown is necessary because the plugin tree is a nested object of functions; a closed group union is infeasible in this walker
		const endpointTree = plugin.endpoints as Record<string, unknown>;

		const endpointByPath = new Map<
			string,
			// unknown is necessary because the walker invokes every operation with fixture bags; a closed input/output union is infeasible across 53 routes
			(ctx: FlutterwaveHandlerContext, input: unknown) => Promise<unknown>
		>();
		for (const [group, groupValue] of Object.entries(endpointTree)) {
			if (!groupValue || typeof groupValue !== 'object') continue;
			for (const [name, operation] of Object.entries(groupValue)) {
				if (typeof operation === 'function') {
					endpointByPath.set(
						`${group}.${name}`,
						operation as (
							ctx: FlutterwaveHandlerContext,
							input: unknown,
						) => Promise<unknown>,
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
			// unknown is necessary because fixtures are untyped example bags; a closed fixture union is infeasible because each route samples different fields
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

	it('keeps flat write fields when body is an empty object', async () => {
		const plugin = flutterwave({ key: 'test-api-key' });
		await plugin.endpoints!.paymentLinks.create(mockCtx, {
			...paymentLinkInput,
			body: {},
		});

		expect(mockRequest.mock.calls[0][1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/payments',
				body: expect.objectContaining(paymentLinkInput),
			}),
		);
	});

	it('does not forward caller headers into the Flutterwave request', async () => {
		const plugin = flutterwave({ key: 'test-api-key' });
		await plugin.endpoints!.transactions.list(mockCtx, {
			page: 1,
			headers: { Authorization: 'Bearer stolen' },
		});

		expect(mockRequest.mock.calls[0][0].HEADERS.Authorization).toBe(
			'Bearer test-api-key',
		);
		expect(mockRequest.mock.calls[0][1].headers).toBeUndefined();
	});

	it('enforces route-specific input schemas for provider-required fields', () => {
		const createBeneficiarySchema =
			flutterwaveEndpointSchemas['beneficiaries.create']?.input;
		const createBulkVirtualAccountsSchema =
			flutterwaveEndpointSchemas['bulkVirtualAccounts.create']?.input;
		const getBulkTokenizedChargeSchema =
			flutterwaveEndpointSchemas['bulkTokenizedCharges.get']?.input;
		const createPaymentLinkSchema =
			flutterwaveEndpointSchemas['paymentLinks.create']?.input;
		const createSubaccountSchema =
			flutterwaveEndpointSchemas['subaccounts.create']?.input;
		const getTransactionSchema =
			flutterwaveEndpointSchemas['transactions.get']?.input;

		expect(createBeneficiarySchema).toBeDefined();
		expect(createBulkVirtualAccountsSchema).toBeDefined();
		expect(getBulkTokenizedChargeSchema).toBeDefined();
		expect(createPaymentLinkSchema).toBeDefined();
		expect(createSubaccountSchema).toBeDefined();
		expect(getTransactionSchema).toBeDefined();

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

		expect(createPaymentLinkSchema!.safeParse({}).success).toBe(false);
		expect(createPaymentLinkSchema!.safeParse(paymentLinkInput).success).toBe(
			true,
		);
		expect(
			createPaymentLinkSchema!.safeParse({
				tx_ref: 'tx-ref-1',
				amount: 1000,
				customer: { email: 'user@example.com' },
			}).success,
		).toBe(true);
		expect(
			createPaymentLinkSchema!.safeParse({
				tx_ref: 'tx-ref-1',
				amount: 1000,
			}).success,
		).toBe(false);
		expect(createSubaccountSchema!.safeParse({}).success).toBe(false);
		expect(getTransactionSchema!.safeParse({}).success).toBe(false);
		expect(getTransactionSchema!.safeParse({ id: 1190701 }).success).toBe(true);

		const createVirtualAccountSchema =
			flutterwaveEndpointSchemas['virtualAccounts.create']?.input;
		const initiateBvnSchema =
			flutterwaveEndpointSchemas['verification.initiateBvn']?.input;
		expect(createVirtualAccountSchema).toBeDefined();
		expect(initiateBvnSchema).toBeDefined();
		expect(
			createVirtualAccountSchema!.safeParse({
				email: 'user@example.com',
				firstname: 'Alexis',
				lastname: 'Sanchez',
			}).success,
		).toBe(true);
		expect(
			createVirtualAccountSchema!.safeParse({
				email: 'user@example.com',
				tx_ref: 'tx-ref-1',
				amount: 1000,
				narration: 'Payment',
			}).success,
		).toBe(false);
		expect(
			initiateBvnSchema!.safeParse({
				bvn: '12345678901',
				firstname: 'John',
				lastname: 'Doe',
			}).success,
		).toBe(true);

		const paymentLinkOutput =
			flutterwaveEndpointSchemas['paymentLinks.create']?.output;
		const transactionOutput =
			flutterwaveEndpointSchemas['transactions.get']?.output;
		const virtualAccountOutput =
			flutterwaveEndpointSchemas['virtualAccounts.create']?.output;
		expect(paymentLinkOutput).toBeDefined();
		expect(transactionOutput).toBeDefined();
		expect(virtualAccountOutput).toBeDefined();
		expect(paymentLinkOutput).not.toBe(transactionOutput);
		expect(transactionOutput).not.toBe(virtualAccountOutput);
		expect(
			paymentLinkOutput!.safeParse({
				status: 'success',
				data: { link: 'https://checkout.flutterwave.com/v3/hosted/pay/x' },
			}).success,
		).toBe(true);
		expect(
			transactionOutput!.safeParse({
				status: 'success',
				data: {
					id: 1190701,
					tx_ref: 'tx-ref-1',
					amount: 1000,
					currency: 'NGN',
				},
			}).success,
		).toBe(true);
		expect(
			virtualAccountOutput!.safeParse({
				status: 'success',
				data: {
					account_number: '0690000040',
					bank_name: 'TEST BANK',
					order_ref: 'URF_1',
				},
			}).success,
		).toBe(true);
	});
});
