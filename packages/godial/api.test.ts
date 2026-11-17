import { makeGoDialRequest } from './client';
import { GoDialEndpointOutputSchemas } from './endpoints/types';

const liveApiKey = process.env.GODIAL_API_KEY;
const liveTest = liveApiKey ? test : test.skip;

if (!liveApiKey) {
	console.warn(
		'Skipping GoDial live API test: set GODIAL_API_KEY to enable it.',
	);
}

liveTest('lists GoDial lists with a real read-only request', async () => {
	const result = await makeGoDialRequest('/meta/api/externals/lists/list', {
		method: 'GET',
		apiKey: liveApiKey ?? '',
	});
	expect(GoDialEndpointOutputSchemas.listsList.parse(result)).toBeDefined();
});
