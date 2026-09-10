import 'dotenv/config';
import { makeBlackbaudRequest } from './client';
import type {
	GetGiftByIdResponse,
	GetPaymentTransactionResponse,
	ListMembershipsResponse,
	OneRosterOAuth2BaseApiResponse,
} from './endpoints/types';
import { BlackbaudEndpointOutputSchemas } from './endpoints/types';

const ACCESS_TOKEN = process.env.BLACKBAUD_ACCESS_TOKEN;
const SUBSCRIPTION_KEY = process.env.BLACKBAUD_SUBSCRIPTION_KEY;
const TEST_GIFT_ID = process.env.TEST_BLACKBAUD_GIFT_ID;
const TEST_CONSTITUENT_ID = process.env.TEST_BLACKBAUD_CONSTITUENT_ID;
const TEST_TRANSACTION_ID = process.env.TEST_BLACKBAUD_TRANSACTION_ID;
const TEST_BATCH_ID = process.env.TEST_BLACKBAUD_BATCH_ID;

const describeIfCreds =
	ACCESS_TOKEN && SUBSCRIPTION_KEY ? describe : describe.skip;

// unknown-free env helper: narrows string|undefined via runtime check.
function requireEnv(value: string | undefined, name: string): string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`Missing ${name}`);
	}
	return value;
}

function requestOptions() {
	return {
		subscriptionKey: requireEnv(SUBSCRIPTION_KEY, 'BLACKBAUD_SUBSCRIPTION_KEY'),
	};
}

describeIfCreds('Blackbaud live API', () => {
	const token = (): string =>
		requireEnv(ACCESS_TOKEN, 'BLACKBAUD_ACCESS_TOKEN');

	it('getGiftById returns a gift record', async () => {
		if (!TEST_GIFT_ID) {
			return;
		}
		const response = await makeBlackbaudRequest<GetGiftByIdResponse>(
			`gift/v1/gifts/${encodeURIComponent(TEST_GIFT_ID)}`,
			token(),
			requestOptions(),
		);

		expect(response).toBeDefined();
		const parsed = BlackbaudEndpointOutputSchemas.getGiftById.parse(response);
		expect(parsed).toBeDefined();
	});

	it('listMemberships returns a membership collection', async () => {
		if (!TEST_CONSTITUENT_ID) {
			return;
		}
		const response = await makeBlackbaudRequest<ListMembershipsResponse>(
			`constituent/v1/constituents/${encodeURIComponent(TEST_CONSTITUENT_ID)}/memberships`,
			token(),
			requestOptions(),
		);

		expect(response).toBeDefined();
		const parsed =
			BlackbaudEndpointOutputSchemas.listMemberships.parse(response);
		expect(parsed).toBeDefined();
		expect(Array.isArray(parsed.value)).toBe(true);
	});

	it('getPaymentTransaction returns a transaction record', async () => {
		if (!TEST_TRANSACTION_ID) {
			return;
		}
		const response = await makeBlackbaudRequest<GetPaymentTransactionResponse>(
			`payments/v1/transactions/${encodeURIComponent(TEST_TRANSACTION_ID)}`,
			token(),
			requestOptions(),
		);

		expect(response).toBeDefined();
		const parsed =
			BlackbaudEndpointOutputSchemas.getPaymentTransaction.parse(response);
		expect(parsed).toBeDefined();
	});

	it('oneRoster discovery returns openid-configuration', async () => {
		const response = await makeBlackbaudRequest<OneRosterOAuth2BaseApiResponse>(
			'https://oauth2.sky.blackbaud.com/.well-known/openid-configuration',
			token(),
			requestOptions(),
		);

		expect(response).toBeDefined();
		const parsed =
			BlackbaudEndpointOutputSchemas.oneRosterOAuth2BaseApi.parse(response);
		expect(parsed).toBeDefined();
		expect(parsed.issuer ?? parsed.token_endpoint).toBeDefined();
	});

	it('addGiftsToBatch posts gifts to a batch', async () => {
		if (!TEST_BATCH_ID) {
			return;
		}
		const response = await makeBlackbaudRequest<{ status_code: number }>(
			`gift/v1/giftbatches/${encodeURIComponent(TEST_BATCH_ID)}/gifts`,
			token(),
			{
				method: 'POST',
				body: { gifts: [] },
				...requestOptions(),
			},
		);

		expect(response).toBeDefined();
	});
});
