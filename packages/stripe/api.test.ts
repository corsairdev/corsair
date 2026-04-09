import 'dotenv/config';
import { makeStripeRequest } from './client';
import type {
	BalanceGetResponse,
	ChargesCreateResponse,
	ChargesGetResponse,
	ChargesListResponse,
	ChargesUpdateResponse,
	CouponsCreateResponse,
	CouponsListResponse,
	CustomersCreateResponse,
	CustomersDeleteResponse,
	CustomersGetResponse,
	CustomersListResponse,
	PaymentIntentsCreateResponse,
	PaymentIntentsGetResponse,
	PaymentIntentsListResponse,
	PaymentIntentsUpdateResponse,
	PricesCreateResponse,
	PricesListResponse,
	SourcesCreateResponse,
	SourcesGetResponse,
} from './endpoints/types';
import { StripeEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.STRIPE_API_KEY!;

describe('Stripe API Type Tests', () => {
	describe('balance', () => {
		it('balanceGet returns correct type', async () => {
			const result = await makeStripeRequest<BalanceGetResponse>(
				'balance',
				TEST_API_KEY,
				{ method: 'GET' },
			);

			StripeEndpointOutputSchemas.balanceGet.parse(result);
		});
	});

	describe('charges', () => {
		let testChargeId: string | undefined;

		it('chargesList returns correct type', async () => {
			const result = await makeStripeRequest<ChargesListResponse>(
				'charges',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);

			if (result.data && result.data.length > 0 && result.data[0]?.id) {
				testChargeId = result.data[0].id;
			}

			StripeEndpointOutputSchemas.chargesList.parse(result);
		});

		it('chargesCreate returns correct type', async () => {
			// Note: creating a charge requires a valid payment source; skip if no test token available
			// This test documents the expected response shape
			const result = await makeStripeRequest<ChargesCreateResponse>(
				'charges',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						amount: 2000,
						currency: 'usd',
						source: 'tok_visa',
						description: 'Test charge from API test',
					},
				},
			);

			if (result.id) {
				testChargeId = result.id;
			}

			StripeEndpointOutputSchemas.chargesCreate.parse(result);
		});

		it('chargesGet returns correct type', async () => {
			if (!testChargeId) {
				const listResult = await makeStripeRequest<ChargesListResponse>(
					'charges',
					TEST_API_KEY,
					{ query: { limit: 1 } },
				);
				const firstId = listResult.data?.[0]?.id;
				if (!firstId) {
					throw new Error('No charges found to test chargesGet');
				}
				testChargeId = firstId;
			}

			const result = await makeStripeRequest<ChargesGetResponse>(
				`charges/${testChargeId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			StripeEndpointOutputSchemas.chargesGet.parse(result);
		});

		it('chargesUpdate returns correct type', async () => {
			if (!testChargeId) {
				const listResult = await makeStripeRequest<ChargesListResponse>(
					'charges',
					TEST_API_KEY,
					{ query: { limit: 1 } },
				);
				const firstId = listResult.data?.[0]?.id;
				if (!firstId) {
					throw new Error('No charges found to test chargesUpdate');
				}
				testChargeId = firstId;
			}

			const result = await makeStripeRequest<ChargesUpdateResponse>(
				`charges/${testChargeId}`,
				TEST_API_KEY,
				{
					method: 'POST',
					body: { description: 'Updated by API test' },
				},
			);

			StripeEndpointOutputSchemas.chargesUpdate.parse(result);
		});
	});

	describe('coupons', () => {
		it('couponsList returns correct type', async () => {
			const result = await makeStripeRequest<CouponsListResponse>(
				'coupons',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);

			StripeEndpointOutputSchemas.couponsList.parse(result);
		});

		it('couponsCreate returns correct type', async () => {
			const result = await makeStripeRequest<CouponsCreateResponse>(
				'coupons',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						percent_off: 25,
						duration: 'once',
						name: `Test Coupon ${Date.now()}`,
					},
				},
			);

			StripeEndpointOutputSchemas.couponsCreate.parse(result);
		});
	});

	describe('customers', () => {
		let testCustomerId: string | undefined;

		it('customersList returns correct type', async () => {
			const result = await makeStripeRequest<CustomersListResponse>(
				'customers',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);

			if (result.data && result.data.length > 0 && result.data[0]?.id) {
				testCustomerId = result.data[0].id;
			}

			StripeEndpointOutputSchemas.customersList.parse(result);
		});

		it('customersCreate returns correct type', async () => {
			const result = await makeStripeRequest<CustomersCreateResponse>(
				'customers',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						email: `test-${Date.now()}@example.com`,
						name: 'Test Customer',
						description: 'Created by API test',
					},
				},
			);

			if (result.id) {
				testCustomerId = result.id;
			}

			StripeEndpointOutputSchemas.customersCreate.parse(result);
		});

		it('customersGet returns correct type', async () => {
			if (!testCustomerId) {
				const listResult = await makeStripeRequest<CustomersListResponse>(
					'customers',
					TEST_API_KEY,
					{ query: { limit: 1 } },
				);
				const firstId = listResult.data?.[0]?.id;
				if (!firstId) {
					throw new Error('No customers found to test customersGet');
				}
				testCustomerId = firstId;
			}

			const result = await makeStripeRequest<CustomersGetResponse>(
				`customers/${testCustomerId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			StripeEndpointOutputSchemas.customersGet.parse(result);
		});

		it('customersDelete returns correct type', async () => {
			// Create a disposable customer to delete
			const created = await makeStripeRequest<CustomersCreateResponse>(
				'customers',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						email: `delete-test-${Date.now()}@example.com`,
						name: 'Delete Test Customer',
					},
				},
			);

			const result = await makeStripeRequest<CustomersDeleteResponse>(
				`customers/${created.id}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			StripeEndpointOutputSchemas.customersDelete.parse(result);
		});
	});

	describe('paymentIntents', () => {
		let testPaymentIntentId: string | undefined;

		it('paymentIntentsList returns correct type', async () => {
			const result = await makeStripeRequest<PaymentIntentsListResponse>(
				'payment_intents',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);

			if (result.data && result.data.length > 0 && result.data[0]?.id) {
				testPaymentIntentId = result.data[0].id;
			}

			StripeEndpointOutputSchemas.paymentIntentsList.parse(result);
		});

		it('paymentIntentsCreate returns correct type', async () => {
			const result = await makeStripeRequest<PaymentIntentsCreateResponse>(
				'payment_intents',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						amount: 1000,
						currency: 'usd',
						description: 'Test payment intent from API test',
					},
				},
			);

			if (result.id) {
				testPaymentIntentId = result.id;
			}

			StripeEndpointOutputSchemas.paymentIntentsCreate.parse(result);
		});

		it('paymentIntentsGet returns correct type', async () => {
			if (!testPaymentIntentId) {
				const listResult = await makeStripeRequest<PaymentIntentsListResponse>(
					'payment_intents',
					TEST_API_KEY,
					{ query: { limit: 1 } },
				);
				const firstId = listResult.data?.[0]?.id;
				if (!firstId) {
					throw new Error('No payment intents found to test paymentIntentsGet');
				}
				testPaymentIntentId = firstId;
			}

			const result = await makeStripeRequest<PaymentIntentsGetResponse>(
				`payment_intents/${testPaymentIntentId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			StripeEndpointOutputSchemas.paymentIntentsGet.parse(result);
		});

		it('paymentIntentsUpdate returns correct type', async () => {
			if (!testPaymentIntentId) {
				const listResult = await makeStripeRequest<PaymentIntentsListResponse>(
					'payment_intents',
					TEST_API_KEY,
					{ query: { limit: 1 } },
				);
				const firstId = listResult.data?.[0]?.id;
				if (!firstId) {
					throw new Error(
						'No payment intents found to test paymentIntentsUpdate',
					);
				}
				testPaymentIntentId = firstId;
			}

			const result = await makeStripeRequest<PaymentIntentsUpdateResponse>(
				`payment_intents/${testPaymentIntentId}`,
				TEST_API_KEY,
				{
					method: 'POST',
					body: { description: 'Updated by API test' },
				},
			);

			StripeEndpointOutputSchemas.paymentIntentsUpdate.parse(result);
		});
	});

	describe('prices', () => {
		it('pricesList returns correct type', async () => {
			const result = await makeStripeRequest<PricesListResponse>(
				'prices',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);

			StripeEndpointOutputSchemas.pricesList.parse(result);
		});

		it('pricesCreate returns correct type', async () => {
			const result = await makeStripeRequest<PricesCreateResponse>(
				'prices',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						currency: 'usd',
						unit_amount: 1000,
						product_data: { name: 'Test Product' },
					},
				},
			);

			StripeEndpointOutputSchemas.pricesCreate.parse(result);
		});
	});

	describe('sources', () => {
		let testSourceId: string | undefined;

		it('sourcesCreate returns correct type', async () => {
			const result = await makeStripeRequest<SourcesCreateResponse>(
				'sources',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						type: 'card',
						currency: 'usd',
						token: 'tok_visa',
					},
				},
			);

			if (result.id) {
				testSourceId = result.id;
			}

			StripeEndpointOutputSchemas.sourcesCreate.parse(result);
		});

		it('sourcesGet returns correct type', async () => {
			if (!testSourceId) {
				// sourcesGet requires a source ID — if create did not run first, skip gracefully
				throw new Error('No source ID available — run sourcesCreate first');
			}

			const result = await makeStripeRequest<SourcesGetResponse>(
				`sources/${testSourceId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			StripeEndpointOutputSchemas.sourcesGet.parse(result);
		});
	});
});
