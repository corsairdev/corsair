import 'dotenv/config';
import { makeRazorpayRequest } from './client';
import type {
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
        return API_KEY_ID.concat(":").concat(API_SECRET_KEY);
    }

    const API_KEY = generateAPIKey();

    describe('payouts', () => {

        it('payoutsList returns correct type', async () => {

            if (!TEST_PAYOUT_ACCOUNT_NUMBER) {
				throw new Error(
					'RAZORPAY_TEST_ACCOUNT_NUMBER is required to run Razorpay payoutList test',
				);
            }

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

            if (!TEST_PAYOUT_ACCOUNT_NUMBER) {
                throw new Error(
                    'RAZORPAY_TEST_ACCOUNT_NUMBER is required to run Razorpay payout tests',
                );
            }

            if (!TEST_PAYOUT_ID) {
                throw new Error(
                    'TEST_PAYOUT_ID is required to run Razorpay payoutGet test',
                );
            }

            const result = await makeRazorpayRequest<PayoutsGetResponse>(
                `payouts/${TEST_PAYOUT_ID}`,
                API_KEY,
                { method: 'GET' },
            );

            RazorpayEndpointOutputSchemas.payoutsGet.parse(result);
        });

        it('payoutsCreate returns correct type', async () => {

            if (!TEST_PAYOUT_ACCOUNT_NUMBER) {
                throw new Error(
                    'RAZORPAY_TEST_ACCOUNT_NUMBER is required to run Razorpay payout tests',
                );
            }

            if (!TEST_PAYOUT_ID) {
                throw new Error(
                    'TEST_PAYOUT_ID is required to run Razorpay payoutGet test',
                );
            }

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
});