import 'dotenv/config';
import { makeKrakenRequest } from './client';
import type {
	CheckStatusResponse,
	OptimizeImageUrlResponse,
} from './endpoints/types';
import { KrakenEndpointOutputSchemas } from './endpoints/types';

// Live API tests — skipped unless both KRAKEN_API_KEY and KRAKEN_API_SECRET
// are set in the environment. They hit the real Kraken.io API and prove the
// output schemas accept the shapes the provider actually returns.
const KRAKEN_API_KEY = process.env.KRAKEN_API_KEY;
const KRAKEN_API_SECRET = process.env.KRAKEN_API_SECRET;

// A small, stable, publicly reachable test image.
const TEST_IMAGE_URL =
	'https://raw.githubusercontent.com/kraken-io/kraken-php/master/tests/fixtures/tapir.png';

const describeLive =
	KRAKEN_API_KEY && KRAKEN_API_SECRET ? describe : describe.skip;

describeLive('Kraken.io API type tests', () => {
	const credentials = {
		apiKey: KRAKEN_API_KEY!,
		apiSecret: KRAKEN_API_SECRET!,
	};

	it('user_status returns correct type', async () => {
		const response = await makeKrakenRequest<CheckStatusResponse>(
			'user_status',
			credentials,
		);

		const parsed =
			KrakenEndpointOutputSchemas.accountCheckStatus.parse(response);
		expect(parsed.success).toBe(true);
		expect(typeof parsed.quota_remaining).toBe('number');
	});

	it('v1/url optimize (sandbox) returns correct type without spending quota', async () => {
		const response = await makeKrakenRequest<OptimizeImageUrlResponse>(
			'v1/url',
			credentials,
			{ url: TEST_IMAGE_URL, wait: true, dev: true },
		);

		const parsed = KrakenEndpointOutputSchemas.imageOptimizeUrl.parse(response);
		expect(parsed.success).toBe(true);
		expect(typeof parsed.kraked_url).toBe('string');
	});
});
