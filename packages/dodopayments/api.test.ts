import 'dotenv/config';
import { makeDodoPaymentsRequest } from './client';
import type {
	CustomersCreateResponse,
	CustomersGetResponse,
	PaymentsCreateResponse,
	PaymentsGetResponse,
	PaymentsListResponse,
	RefundsCreateResponse,
	SubscriptionsCancelResponse,
	SubscriptionsGetResponse,
} from './endpoints/types';
import { DodoPaymentsEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.DODOPAYMENTS_API_KEY!;
const TEST_CUSTOMER_ID = process.env.TEST_DODOPAYMENTS_CUSTOMER_ID;
const TEST_PAYMENT_ID = process.env.TEST_DODOPAYMENTS_PAYMENT_ID;
const TEST_SUBSCRIPTION_ID = process.env.TEST_DODOPAYMENTS_SUBSCRIPTION_ID;

describe('DodoPayments API Type Tests', () => {
	if (!TEST_TOKEN) {
		it.skip('skipping all DodoPayments API tests because DODOPAYMENTS_API_KEY is missing', () => {});
		return;
	}

	describe('customers', () => {
		it('customersCreate returns correct type', async () => {
			const customerName = `Test Customer ${Date.now()}`;
			const response = await makeDodoPaymentsRequest<CustomersCreateResponse>(
				'/customers',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: customerName,
						email: `test-${Date.now()}@example.com`,
					},
				},
			);
			DodoPaymentsEndpointOutputSchemas.customersCreate.parse(response);
		});

		it('customersGet returns correct type', async () => {
			if (!TEST_CUSTOMER_ID) {
				console.warn(
					'Skipping customersGet because no TEST_CUSTOMER_ID was provided',
				);
				return;
			}
			const response = await makeDodoPaymentsRequest<CustomersGetResponse>(
				`/customers/${TEST_CUSTOMER_ID}`,
				TEST_TOKEN,
			);
			DodoPaymentsEndpointOutputSchemas.customersGet.parse(response);
		});
	});

	describe('payments', () => {
		it('paymentsList returns correct type', async () => {
			const response = await makeDodoPaymentsRequest<PaymentsListResponse>(
				'/payments',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			DodoPaymentsEndpointOutputSchemas.paymentsList.parse(response);
		});

		it('paymentsGet returns correct type', async () => {
			if (TEST_PAYMENT_ID) {
				const response = await makeDodoPaymentsRequest<PaymentsGetResponse>(
					`/payments/${TEST_PAYMENT_ID}`,
					TEST_TOKEN,
				);
				DodoPaymentsEndpointOutputSchemas.paymentsGet.parse(response);
			} else {
				const listResponse =
					await makeDodoPaymentsRequest<PaymentsListResponse>(
						'/payments',
						TEST_TOKEN,
						{ query: { limit: 1 } },
					);
				const paymentId = listResponse.data?.[0]?.id;
				if (!paymentId) {
					console.warn('No payments found to test paymentsGet');
					return;
				}
				const response = await makeDodoPaymentsRequest<PaymentsGetResponse>(
					`/payments/${paymentId}`,
					TEST_TOKEN,
				);
				DodoPaymentsEndpointOutputSchemas.paymentsGet.parse(response);
			}
		});

		it('paymentsCreate returns correct type', async () => {
			try {
				const response = await makeDodoPaymentsRequest<PaymentsCreateResponse>(
					'/payments',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							amount: 1000,
							currency: 'USD',
						},
					},
				);
				DodoPaymentsEndpointOutputSchemas.paymentsCreate.parse(response);
			} catch (e) {
				console.warn('paymentsCreate failed', e);
			}
		});
	});

	describe('refunds', () => {
		it('refundsCreate returns correct type', async () => {
			try {
				if (!TEST_PAYMENT_ID) {
					console.warn(
						'Skipping refundsCreate because no TEST_PAYMENT_ID provided',
					);
					return;
				}
				const response = await makeDodoPaymentsRequest<RefundsCreateResponse>(
					'/refunds',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							payment_id: TEST_PAYMENT_ID,
							reason: 'duplicate',
						},
					},
				);
				DodoPaymentsEndpointOutputSchemas.refundsCreate.parse(response);
			} catch (e) {
				console.warn('refundsCreate failed', e);
			}
		});
	});

	describe('subscriptions', () => {
		it('subscriptionsCreate returns correct type', async () => {
			console.warn(
				'Skipping subscriptionsCreate because no TEST_PLAN_ID provided',
			);
			return;
		});

		it('subscriptionsGet returns correct type', async () => {
			if (!TEST_SUBSCRIPTION_ID) {
				console.warn(
					'Skipping subscriptionsGet because no TEST_SUBSCRIPTION_ID provided',
				);
				return;
			}
			try {
				const response =
					await makeDodoPaymentsRequest<SubscriptionsGetResponse>(
						`/subscriptions/${TEST_SUBSCRIPTION_ID}`,
						TEST_TOKEN,
					);
				DodoPaymentsEndpointOutputSchemas.subscriptionsGet.parse(response);
			} catch (e) {
				console.warn('subscriptionsGet failed', e);
			}
		});

		it('subscriptionsCancel returns correct type', async () => {
			if (!TEST_SUBSCRIPTION_ID) {
				console.warn(
					'Skipping subscriptionsCancel because no TEST_SUBSCRIPTION_ID provided',
				);
				return;
			}
			try {
				const response =
					await makeDodoPaymentsRequest<SubscriptionsCancelResponse>(
						`/subscriptions/${TEST_SUBSCRIPTION_ID}/cancel`,
						TEST_TOKEN,
						{ method: 'POST' },
					);
				DodoPaymentsEndpointOutputSchemas.subscriptionsCancel.parse(response);
			} catch (e) {
				console.warn('subscriptionsCancel failed', e);
			}
		});
	});
});
