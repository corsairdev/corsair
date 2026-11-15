import { makeProductboardRequest } from './client';
import type { ProductboardOutput } from './endpoints/types';
import { ProductboardOutputSchema } from './endpoints/types';

const productboardApiKey = process.env.PRODUCTBOARD_API_KEY;

if (!productboardApiKey) {
	console.warn(
		'Skipping Productboard live API test: PRODUCTBOARD_API_KEY is not set.',
	);
}

const liveTest = productboardApiKey ? it : it.skip;

liveTest('lists Productboard teams with a read-only request', async () => {
	const response = await makeProductboardRequest<ProductboardOutput>(
		'/teams',
		productboardApiKey ?? '',
		{ method: 'GET' },
	);
	expect(ProductboardOutputSchema.safeParse(response).success).toBe(true);
});
