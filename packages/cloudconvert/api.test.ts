// Live tests use only read-only CloudConvert routes and require an explicit key.
import { makeCloudConvertRequest } from './client';
import type { CloudConvertEndpointOutputs } from './endpoints/types';
import { CloudConvertEndpointOutputSchemas as Outputs } from './endpoints/types';

const KEY = process.env.CLOUDCONVERT_API_KEY ?? '';
const describeLive = KEY.length > 0 ? describe : describe.skip;

describeLive('CloudConvert live API (env-gated)', () => {
	it('GET /v2/tasks returns a validated first page', async () => {
		const response = await makeCloudConvertRequest<
			CloudConvertEndpointOutputs['tasksList']
		>(KEY, {
			method: 'GET',
			path: '/tasks',
			query: { per_page: 1, page: 1 },
		});

		const parsed = Outputs.tasksList.parse(response);
		expect(parsed.data.length).toBeLessThanOrEqual(1);
		expect(parsed.meta?.current_page).toBe(1);
	});

	it('GET /v2/users/me returns a validated account summary', async () => {
		const response = await makeCloudConvertRequest<
			CloudConvertEndpointOutputs['usersShow']
		>(KEY, { method: 'GET', path: '/users/me' });

		const parsed = Outputs.usersShow.parse(response);
		expect(typeof parsed.data.username).toBe('string');
		expect(typeof parsed.data.credits).toBe('number');
		expect(typeof parsed.data.created_at).toBe('string');
	});
});
