import 'dotenv/config';
import { makeRazorpayRequest } from './client';
import type {
	OrdersCreateResponse,
	OrdersGetResponse,
	PaymentsGetResponse,
	PaymentsListResponse,
	RefundsCreateResponse,
} from './endpoints/types';
import { RazorpayEndpointOutputSchemas } from './endpoints/types';

const KEY_ID = process.env.RAZORPAY_KEY_ID!;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const API_KEY = `${KEY_ID}:${KEY_SECRET}`;
const TEST_CAPTURED_PAYMENT_ID = process.env.RAZORPAY_TEST_CAPTURED_PAYMENT_ID;

describe('Razorpay API Type Tests', () => {
	describe('orders', () => {
		let createdOrderId: string | undefined;

		it('ordersCreate returns correct type', async () => {
			const response = await makeRazorpayRequest<OrdersCreateResponse>(
				'orders',
				API_KEY,
				{
					method: 'POST',
					body: {
						amount: 50000,
						currency: 'INR',
						receipt: `rcpt_test_${Date.now()}`,
						notes: { source: 'api-test' },
					},
				},
			);

			createdOrderId = response.id;
			console.log('Created order:', response, '—', response.status);

			RazorpayEndpointOutputSchemas.ordersCreate.parse(response);
		});

		it('ordersGet returns correct type', async () => {
			if (!createdOrderId) {
				const createResponse = await makeRazorpayRequest<OrdersCreateResponse>(
					'orders',
					API_KEY,
					{
						method: 'POST',
						body: {
							amount: 10000,
							currency: 'INR',
						},
					},
				);
				createdOrderId = createResponse.id;
			}

			const response = await makeRazorpayRequest<OrdersGetResponse>(
				`orders/${createdOrderId}`,
				API_KEY,
				{ method: 'GET' },
			);

			console.log('Fetched order:', response, '— attempts:', response.attempts);

			RazorpayEndpointOutputSchemas.ordersGet.parse(response);
		});
	});

	describe('payments', () => {
		it('paymentsList returns correct type', async () => {
			const response = await makeRazorpayRequest<PaymentsListResponse>(
				'payments',
				API_KEY,
				{ method: 'GET', query: { count: 10 } },
			);

			console.log('Payments count:', response.count);
			response.items.slice(0, 3).forEach((p) => {
				console.log(`  [${p.id}] ${p.status} — ${p.amount} ${p.currency}`);
			});

			RazorpayEndpointOutputSchemas.paymentsList.parse(response);
		});

		it('paymentsGet returns correct type', async () => {
			const listResponse = await makeRazorpayRequest<PaymentsListResponse>(
				'payments',
				API_KEY,
				{ method: 'GET', query: { count: 1 } },
			);

			const paymentId = listResponse.items[0]?.id;
			if (!paymentId) {
				console.warn('No payments found in account — skipping paymentsGet test');
				return;
			}

			const response = await makeRazorpayRequest<PaymentsGetResponse>(
				`payments/${paymentId}`,
				API_KEY,
				{ method: 'GET' },
			);

			console.log('Fetched payment:', response.id, '—', response.status);

			RazorpayEndpointOutputSchemas.paymentsGet.parse(response);
		});
	});

	describe('refunds', () => {
		it('refundsCreate returns correct type', async () => {
			if (!TEST_CAPTURED_PAYMENT_ID) {
				console.warn(
					'RAZORPAY_TEST_CAPTURED_PAYMENT_ID not set — skipping refund test',
				);
				return;
			}

			const response = await makeRazorpayRequest<RefundsCreateResponse>(
				`payments/${TEST_CAPTURED_PAYMENT_ID}/refund`,
				API_KEY,
				{
					method: 'POST',
					body: { speed: 'normal' },
				},
			);

			console.log('Created refund:', response.id, '—', response.status, 'amount:', response.amount);

			RazorpayEndpointOutputSchemas.refundsCreate.parse(response);
		});
	});
});
