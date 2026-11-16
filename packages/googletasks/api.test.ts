import { makeGoogleTasksRequest } from './client';
import { GoogleTasksEndpointOutputSchemas } from './endpoints/types';

const accessToken = process.env.GOOGLETASKS_ACCESS_TOKEN;
const liveTest = accessToken ? it : it.skip;
if (!accessToken) {
	console.warn(
		'GOOGLETASKS_ACCESS_TOKEN is not set; skipping live Google Tasks smoke.',
	);
}

describe('Google Tasks live API smoke', () => {
	liveTest('lists the first read-only task-list page', async () => {
		if (!accessToken) throw new Error('Live access token check did not narrow');
		const response = await makeGoogleTasksRequest('/tasks/v1/users/@me/lists', {
			key: accessToken,
		});
		const page = GoogleTasksEndpointOutputSchemas.taskListsList.parse(response);
		expect(page.items).toBeDefined();
		expect(page.items?.length).toBeLessThanOrEqual(1000);
	});
});
