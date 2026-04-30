import 'dotenv/config';
import { makeRazorpayRequest } from './client';
import type {
	CustomersCreateResponse,
	CustomersGetResponse,
	CustomersListResponse,
	CustomersUpdateResponse,
	PayoutsCreateResponse,
	PayoutsGetResponse,
	PayoutsListResponse,
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

describe('Razorpay API Type Tests', () => {

    function generateAPIKey() {
        if (!API_KEY_ID) {
            throw new Error(
                `Missing required env vars for payout tests: API_KEY_ID}`,
            );
        }

        if (!API_SECRET_KEY) {
            throw new Error(
                `Missing required env vars for payout tests: API_SECRET_KEY}`,
            );
        }

        return API_KEY_ID.concat(":").concat(API_SECRET_KEY);
    }

    const API_KEY = generateAPIKey();

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

		beforeAll(async () => {
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
});