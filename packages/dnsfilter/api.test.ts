import { makeDnsfilterRequest } from './client';
import { DnsfilterEndpointOutputSchemas } from './endpoints/types';

// Live smoke tests run against the real API only when a key is provided:
// DNSFILTER_API_KEY=<key> pnpm test
// Only read-only endpoints with no required parameters are exercised, so the
// suite never mutates an account and never needs an organization id.
const LIVE_KEY = process.env.DNSFILTER_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('DNSFilter live API', () => {
	it('fetches the current user', async () => {
		const response = await makeDnsfilterRequest('/v1/current_user', LIVE_KEY, {
			method: 'GET',
		});
		const parsed =
			DnsfilterEndpointOutputSchemas.currentUsersGet.parse(response);

		expect(parsed.data).toBeDefined();
	});

	it('lists categories', async () => {
		const response = await makeDnsfilterRequest('/v1/categories', LIVE_KEY, {
			method: 'GET',
		});
		const parsed =
			DnsfilterEndpointOutputSchemas.categoriesList.parse(response);

		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('lists user agent releases', async () => {
		const response = await makeDnsfilterRequest(
			'/v1/user_agent_releases',
			LIVE_KEY,
			{ method: 'GET' },
		);
		const parsed =
			DnsfilterEndpointOutputSchemas.userAgentReleasesList.parse(response);

		expect(parsed).toBeDefined();
	});
});
