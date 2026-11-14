// Read-only live smoke tests; run with FIREBERRY_API_KEY and `pnpm test:live`.
import { makeFireberryRequest } from './client';
import { FireberryEndpointOutputSchemas } from './endpoints/types';

const liveKey = process.env.FIREBERRY_API_KEY ?? '';
if (liveKey.length === 0) {
	console.warn('Skipping Fireberry live tests: FIREBERRY_API_KEY is not set.');
}
const describeLive = liveKey.length > 0 ? describe : describe.skip;

describeLive('Fireberry live API (read-only)', () => {
	it('lists one account page and validates the documented envelope', async () => {
		const result = await makeFireberryRequest('/api/record/account', liveKey, {
			query: { pagesize: 1, pagenumber: 1 },
		});
		const parsed = FireberryEndpointOutputSchemas.list.parse(result);
		expect(parsed.success).toBe(true);
		expect(parsed.data.Page_Size).toBe(1);
	});

	it('reads the metadata object catalog', async () => {
		const result = await makeFireberryRequest('/metadata/records', liveKey, {
			metadata: true,
		});
		const parsed = FireberryEndpointOutputSchemas.objects.parse(result);
		expect(parsed.success).toBe(true);
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
