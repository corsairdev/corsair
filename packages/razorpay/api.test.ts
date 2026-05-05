import 'dotenv/config';
import { makeRazorpayRequest } from './client';
import type {
	CustomersCreateResponse,
	CustomersGetResponse,
	CustomersListResponse,
	CustomersUpdateResponse,
	OrdersCreateResponse,
	OrdersGetResponse,
	OrdersListResponse,
	PaymentsCaptureResponse,
	PaymentsGetResponse,
	PaymentsListResponse,
	PayoutsCreateResponse,
	PayoutsGetResponse,
	PayoutsListResponse,
	RefundsCreateResponse,
	RefundsGetResponse,
	RefundsListResponse,
	SettlementsGetResponse,
	SettlementsListResponse,
} from './endpoints/types';
import { RazorpayEndpointOutputSchemas } from './endpoints/types';

const API_KEY_ID = process.env.RAZORPAY_API_KEY!;
const API_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY!;

const TEST_PAYOUT_ACCOUNT_NUMBER = process.env.RAZORPAY_TEST_ACCOUNT_NUMBER;
const TEST_PAYOUT_ID = process.env.RAZORPAY_TEST_PAYOUT_ID;
const CREATE_PAYOUT_ACCOUNT_NUMBER = process.env.RAZORPAY_CREATE_PAYOUT_ACCOUNT_NUMBER;
const CREATE_PAYOUT_FUND_ACCOUNT_ID =
	process.env.RAZORPAY_CREATE_PAYOUT_FUND_ACCOUNT_ID;
const CREATE_PAYOUT_AMOUNT = process.env.RAZORPAY_CREATE_PAYOUT_AMOUNT;
const CREATE_PAYOUT_CURRENCY = process.env.RAZORPAY_CREATE_PAYOUT_CURRENCY;
const CREATE_PAYOUT_MODE = process.env.RAZORPAY_CREATE_PAYOUT_MODE;
const CREATE_PAYOUT_PURPOSE = process.env.RAZORPAY_CREATE_PAYOUT_PURPOSE;

const TEST_PAYMENT_CAPTURE_AMOUNT = process.env.RAZORPAY_TEST_PAYMENT_CAPTURE_AMOUNT;
const TEST_PAYMENT_CAPTURE_CURRENCY =
	process.env.RAZORPAY_TEST_PAYMENT_CAPTURE_CURRENCY;

const TEST_REFUND_PAYMENT_ID = process.env.RAZORPAY_TEST_REFUND_PAYMENT_ID;
const TEST_REFUND_ID = process.env.RAZORPAY_TEST_REFUND_ID;
const CREATE_REFUND_AMOUNT = process.env.RAZORPAY_CREATE_REFUND_AMOUNT
	? Number(process.env.RAZORPAY_CREATE_REFUND_AMOUNT)
	: undefined;

const TEST_SETTLEMENT_ID = process.env.RAZORPAY_TEST_SETTLEMENT_ID;

describe('Razorpay API Type Tests', () => {

    let API_KEY: string;

    beforeAll(() => {
        function generateAPIKey() {
            if (!API_KEY_ID) {
                throw new Error(
                    `Missing required env vars for payout tests: API_KEY_ID`,
                );
            }

            if (!API_SECRET_KEY) {
                throw new Error(
                    `Missing required env vars for payout tests: API_SECRET_KEY`,
                );
            }

            return API_KEY_ID.concat(":").concat(API_SECRET_KEY);
        }

        API_KEY = generateAPIKey();

    });


    describe('payouts', () => {
		beforeAll(() => {
			const requiredEnvVars = [
				{
					key: 'RAZORPAY_TEST_ACCOUNT_NUMBER',
					value: TEST_PAYOUT_ACCOUNT_NUMBER,
				},
				{
					key: 'RAZORPAY_TEST_PAYOUT_ID',
					value: TEST_PAYOUT_ID,
				},
				{
					key: 'RAZORPAY_CREATE_PAYOUT_ACCOUNT_NUMBER',
					value: CREATE_PAYOUT_ACCOUNT_NUMBER,
				},
				{
					key: 'RAZORPAY_CREATE_PAYOUT_FUND_ACCOUNT_ID',
					value: CREATE_PAYOUT_FUND_ACCOUNT_ID,
				},
				{
					key: 'RAZORPAY_CREATE_PAYOUT_AMOUNT',
					value: CREATE_PAYOUT_AMOUNT,
				},
				{
					key: 'RAZORPAY_CREATE_PAYOUT_CURRENCY',
					value: CREATE_PAYOUT_CURRENCY,
				},
				{
					key: 'RAZORPAY_CREATE_PAYOUT_MODE',
					value: CREATE_PAYOUT_MODE,
				},
				{
					key: 'RAZORPAY_CREATE_PAYOUT_PURPOSE',
					value: CREATE_PAYOUT_PURPOSE,
				},
			];

			const missingVars = requiredEnvVars
				.filter(({ value }) => !value)
				.map(({ key }) => key);

			if (missingVars.length > 0) {
				throw new Error(
					`Missing required env vars for payout tests: ${missingVars.join(', ')}`,
				);
			}
		});

        it('payoutsList returns correct type', async () => {

            const result = await makeRazorpayRequest<PayoutsListResponse>(
                'payouts',
                API_KEY,
                {
                    method: 'GET',
                    query: {
                        account_number: TEST_PAYOUT_ACCOUNT_NUMBER,
                    },
                },
                true
            );

            RazorpayEndpointOutputSchemas.payoutsList.parse(result);
        });

        it('payoutsGet returns correct type', async () => {

            const result = await makeRazorpayRequest<PayoutsGetResponse>(
                `payouts/${TEST_PAYOUT_ID}`,
                API_KEY,
                { method: 'GET' },
            );

            RazorpayEndpointOutputSchemas.payoutsGet.parse(result);
        });

        it('payoutsCreate returns correct type', async () => {

            const bodyData: Record<string, unknown> = {
                account_number: CREATE_PAYOUT_ACCOUNT_NUMBER,
                "fund_account_id": CREATE_PAYOUT_FUND_ACCOUNT_ID,
                "amount": CREATE_PAYOUT_AMOUNT
                    ? Number(CREATE_PAYOUT_AMOUNT)
                    : undefined,
                "currency": CREATE_PAYOUT_CURRENCY,
                "mode": CREATE_PAYOUT_MODE,
                "purpose": CREATE_PAYOUT_PURPOSE,
                "queue_if_low_balance": true,
                "reference_id": "Acme Transaction ID 12345",
                "narration": "Acme Corp Fund Transfer",
                "notes": {
                    "notes_key_1": "Tea, Earl Grey, Hot",
                    "notes_key_2": "Tea, Earl Grey… decaf."
                }
            };

            const result = await makeRazorpayRequest<PayoutsCreateResponse>(
                `payouts`,
                API_KEY,
                {
                    method: 'POST',
                    body: bodyData,
                },
                true
            );

            RazorpayEndpointOutputSchemas.payoutsCreate.parse(result);
        });
    });

	describe('customers', () => {
		let createdCustomerId: string | undefined;

        it('customersCreate returns correct type', async () => {
			const result = await makeRazorpayRequest<CustomersCreateResponse>(
				'customers',
				API_KEY,
				{
					method: 'POST',
					body: {
						name: `Corsair Test Customer ${Date.now()}`,
						email: `corsair-${Date.now()}@example.com`,
						contact: '9123456789',
					},
				},
			);

			RazorpayEndpointOutputSchemas.customersCreate.parse(result);
			createdCustomerId = result.id;
		});

		it('customersList returns correct type', async () => {
			const result = await makeRazorpayRequest<CustomersListResponse>(
				'customers',
				API_KEY,
				{
					method: 'GET',
					query: {
						count: 10,
					},
				},
			);

            RazorpayEndpointOutputSchemas.customersList.parse(result);
		});

		it('customersGet returns correct type', async () => {
			if (!createdCustomerId) {
				throw new Error(
					'Unable to run customersGet test because no customer ID was created',
				);
			}

			const result = await makeRazorpayRequest<CustomersGetResponse>(
				`customers/${createdCustomerId}`,
				API_KEY,
				{ method: 'GET' },
			);

            RazorpayEndpointOutputSchemas.customersGet.parse(result);
		});

		it('customersUpdate returns correct type', async () => {
			if (!createdCustomerId) {
				throw new Error(
					'Unable to run customersUpdate test because no customer ID was created',
				);
			}

			const result = await makeRazorpayRequest<CustomersUpdateResponse>(
				`customers/${createdCustomerId}`,
				API_KEY,
				{
					method: 'PUT',
					body: {
						name: `Updated Corsair Customer ${Date.now()}`,
					},
				},
			);

			RazorpayEndpointOutputSchemas.customersUpdate.parse(result);
		});
	});

	describe('orders', () => {
		let createdOrderId: string | undefined;

		it('ordersCreate returns correct type', async () => {
			const result = await makeRazorpayRequest<OrdersCreateResponse>(
				'orders',
				API_KEY,
				{
					method: 'POST',
					body: {
						amount: 100,
						currency: 'INR',
						receipt: `corsair-order-${Date.now()}`,
						notes: {
							order_source: 'corsair-test',
						},
					},
				},
			);

			RazorpayEndpointOutputSchemas.ordersCreate.parse(result);
			createdOrderId = result.id;
		});

		it('ordersList returns correct type', async () => {
			const result = await makeRazorpayRequest<OrdersListResponse>(
				'orders',
				API_KEY,
				{
					method: 'GET',
					query: {
						count: 10,
					},
				},
			);

			RazorpayEndpointOutputSchemas.ordersList.parse(result);
		});

		it('ordersGet returns correct type', async () => {
			if (!createdOrderId) {
				throw new Error(
					'Unable to run ordersGet test because no order ID was created',
				);
			}

			const result = await makeRazorpayRequest<OrdersGetResponse>(
				`orders/${createdOrderId}`,
				API_KEY,
				{ method: 'GET' },
			);

			RazorpayEndpointOutputSchemas.ordersGet.parse(result);
		});
	});

	describe('payments', () => {

		beforeAll(() => {
			const requiredEnvVars = [
				{
					key: 'RAZORPAY_TEST_PAYMENT_CAPTURE_AMOUNT',
					value: TEST_PAYMENT_CAPTURE_AMOUNT,
				},
				{
					key: 'RAZORPAY_TEST_PAYMENT_CAPTURE_CURRENCY',
					value: TEST_PAYMENT_CAPTURE_CURRENCY,
				}
			];


			const missingVars = requiredEnvVars
				.filter(({ value }) => !value)
				.map(({ key }) => key);

			if (missingVars.length > 0) {
				throw new Error(
					`Missing required env vars for payout tests: ${missingVars.join(', ')}`,
				);
			}
		});

		let paymentId: string | undefined;

		it('paymentsList returns correct type', async () => {
			const result = await makeRazorpayRequest<PaymentsListResponse>(
				'payments',
				API_KEY,
				{
					method: 'GET',
					query: {
						count: 10,
					},
				},
			);

			RazorpayEndpointOutputSchemas.paymentsList.parse(result);
			paymentId = result.items[0]?.id;

		});

		it('paymentsGet returns correct type', async () => {
			const result = await makeRazorpayRequest<PaymentsGetResponse>(
				`payments/${paymentId}`,
				API_KEY,
				{ method: 'GET' },
			);

			RazorpayEndpointOutputSchemas.paymentsGet.parse(result);
		});

		it('paymentsCapture returns correct type', async () => {
			const result = await makeRazorpayRequest<PaymentsCaptureResponse>(
				`payments/${paymentId}/capture`,
				API_KEY,
				{
					method: 'POST',
					body: {
						amount: TEST_PAYMENT_CAPTURE_AMOUNT,
						currency: TEST_PAYMENT_CAPTURE_CURRENCY,
					},
				},
			);

			RazorpayEndpointOutputSchemas.paymentsCapture.parse(result);
		});
	});

	describe('refunds', () => {

		beforeAll(() => {
			const requiredEnvVars = [
				{
					key: 'RAZORPAY_TEST_REFUND_PAYMENT_ID',
					value: TEST_REFUND_PAYMENT_ID,
				},
				{
					key: 'RAZORPAY_TEST_REFUND_ID',
					value: TEST_REFUND_ID,
				},
				{
					key: 'RAZORPAY_CREATE_REFUND_AMOUNT',
					value: CREATE_REFUND_AMOUNT,
				}
			];


			const missingVars = requiredEnvVars
				.filter(({ value }) => !value)
				.map(({ key }) => key);

			if (missingVars.length > 0) {
				throw new Error(
					`Missing required env vars for payout tests: ${missingVars.join(', ')}`,
				);
			}
		});

		it('refundsCreate returns correct type', async () => {

			const result = await makeRazorpayRequest<RefundsCreateResponse>(
				`payments/${TEST_REFUND_PAYMENT_ID}/refund`,
				API_KEY,
				{
					method: 'POST',
					body: {
						amount: CREATE_REFUND_AMOUNT,
						speed: 'normal',
					},
				},
			);

			RazorpayEndpointOutputSchemas.refundsCreate.parse(result);
		});

		it('refundsList returns correct type', async () => {

			const result = await makeRazorpayRequest<RefundsListResponse>(
				`payments/${TEST_REFUND_PAYMENT_ID}/refunds`,
				API_KEY,
				{
					method: 'GET',
					query: {
						count: 10,
					},
				},
			);

			RazorpayEndpointOutputSchemas.refundsList.parse(result);
		});

		it('refundsGet returns correct type', async () => {

			const result = await makeRazorpayRequest<RefundsGetResponse>(
				`payments/${TEST_REFUND_PAYMENT_ID}/refunds/${TEST_REFUND_ID}`,
				API_KEY,
				{ method: 'GET' },
			);

			RazorpayEndpointOutputSchemas.refundsGet.parse(result);
		});
	});

	describe('settlements', () => {
		it('settlementsList returns correct type', async () => {
			const result = await makeRazorpayRequest<SettlementsListResponse>(
				'settlements',
				API_KEY,
				{
					method: 'GET',
					query: {
						count: 10,
					},
				},
			);

			console.log(result);
			RazorpayEndpointOutputSchemas.settlementsList.parse(result);
		});

		it('settlementsGet returns correct type', async () => {
			const result = await makeRazorpayRequest<SettlementsGetResponse>(
				`settlements/${TEST_SETTLEMENT_ID}`,
				API_KEY,
				{ method: 'GET' },
			);

			RazorpayEndpointOutputSchemas.settlementsGet.parse(result);
		});
	});
});