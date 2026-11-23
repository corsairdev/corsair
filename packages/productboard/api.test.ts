import { makeProductboardRequest } from './client';
import { ProductboardTeamsListOutputSchema } from './endpoints/types';

const productboardApiKey = process.env.PRODUCTBOARD_API_KEY;

if (!productboardApiKey) {
	console.warn(
		'Skipping Productboard live API test: PRODUCTBOARD_API_KEY is not set.',
	);
}

const liveTest = productboardApiKey ? it : it.skip;

liveTest('lists Productboard teams with a read-only request', async () => {
	// The live provider response is untrusted until the runtime team schema narrows it.
	const response = await makeProductboardRequest<unknown>(
		'/teams',
		productboardApiKey ?? '',
		{ method: 'GET' },
	);
	expect(ProductboardTeamsListOutputSchema.safeParse(response).success).toBe(
		true,
	);
});
