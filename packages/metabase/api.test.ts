// Live suite is excluded from the default Jest run and only performs a collection read.
import { makeMetabaseRequest } from './client';
import { MetabaseEndpointOutputSchemas } from './endpoints/types';

const LIVE_BASE_URL = process.env.METABASE_BASE_URL ?? '';
const LIVE_API_KEY = process.env.METABASE_API_KEY ?? '';
const hasLiveCredentials = LIVE_BASE_URL.length > 0 && LIVE_API_KEY.length > 0;

if (!hasLiveCredentials) {
	console.warn(
		'Skipping Metabase live read test: set METABASE_BASE_URL and METABASE_API_KEY.',
	);
}

const describeLive = hasLiveCredentials ? describe : describe.skip;

describeLive('Metabase live API read', () => {
	it('lists collections visible to the API key group', async () => {
		const response = await makeMetabaseRequest(
			'/api/collection',
			LIVE_API_KEY,
			LIVE_BASE_URL,
			{ method: 'GET' },
		);
		const parsed = MetabaseEndpointOutputSchemas.collectionList.parse(response);
		expect(Array.isArray(parsed)).toBe(true);
	});
});
