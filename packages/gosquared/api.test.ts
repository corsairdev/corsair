import { makeGosquaredRequest } from './client';
import type { GosquaredEndpointOutputs } from './endpoints/types';
import { GosquaredEndpointOutputSchemas } from './endpoints/types';

// Live smoke tests run against the real API only when a key is provided:
// GOSQUARED_API_KEY=<key> pnpm test:live
// Only read-only tokeninfo and sites endpoints are exercised.
const LIVE_KEY = process.env.GOSQUARED_API_KEY ?? '';
const LIVE_SITE_TOKEN = process.env.GOSQUARED_SITE_TOKEN ?? '';

if (!LIVE_KEY) {
	console.warn(
		'Skipping live GoSquared tests: GOSQUARED_API_KEY is not set in environment',
	);
}

const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('GoSquared live API (env-gated)', () => {
	it('GET /auth/v1/tokeninfo validates the API key and returns scopes', async () => {
		const response = await makeGosquaredRequest<
			GosquaredEndpointOutputs['auth.getTokenInfo']
		>('/auth/v1/tokeninfo', LIVE_KEY, {
			method: 'GET',
		});

		const parsed =
			GosquaredEndpointOutputSchemas['auth.getTokenInfo'].parse(response);
		expect(parsed).toBeDefined();
	});

	it('GET /account/v1/sites retrieves accessible sites', async () => {
		const response = await makeGosquaredRequest<
			GosquaredEndpointOutputs['account.getSites']
		>('/account/v1/sites', LIVE_KEY, {
			method: 'GET',
			siteToken: LIVE_SITE_TOKEN || undefined,
		});

		const parsed =
			GosquaredEndpointOutputSchemas['account.getSites'].parse(response);
		expect(parsed).toBeDefined();
	});
});
