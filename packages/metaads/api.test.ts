import { makeMetaAdsRequest } from './client';
import { MetaAdsListSchema } from './endpoints/types';

const token = process.env.METAADS_API_KEY;
if (!token)
	console.warn(
		'Skipping Meta Ads live smoke test: METAADS_API_KEY is not set.',
	);

const live = token ? describe : describe.skip;

live('Meta Ads live API smoke', () => {
	it('reads one ad account page without writing', async () => {
		const response = await makeMetaAdsRequest('/me/adaccounts', token, {
			method: 'GET',
			query: { fields: 'id,name', limit: 1 },
		});
		const parsed = MetaAdsListSchema.parse(response);
		expect(Array.isArray(parsed.data)).toBe(true);
		expect(parsed.data.length).toBeLessThanOrEqual(1);
	});
});
