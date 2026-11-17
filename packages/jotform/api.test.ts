// Live Jotform API smoke tests. Excluded from default runs by
// testPathIgnorePatterns in jest.config.cjs; run with:
//
//   JOTFORM_API_KEY=... pnpm --dir packages/jotform test:live
//
import { makeJotformRequest } from './client';
import { JotformEndpointOutputSchemas } from './endpoints/types';

const LIVE_KEY = process.env.JOTFORM_API_KEY ?? '';
if (!LIVE_KEY) {
	console.warn(
		'[jotform] JOTFORM_API_KEY is not set. Skipping live API integration tests.',
	);
}

const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('jotform live API (env-gated)', () => {
	it('GET /system/plan/FREE is public and returns plan details', async () => {
		const res = await makeJotformRequest('/system/plan/FREE', undefined, {
			method: 'GET',
		});

		const parsed = JotformEndpointOutputSchemas['system.getPlan'].parse(res);
		expect(parsed.responseCode).toBe(200);
		expect(parsed.content.name).toBe('FREE');
	});

	it('GET /user returns user profile for authenticated key', async () => {
		const res = await makeJotformRequest('/user', LIVE_KEY, { method: 'GET' });

		const parsed = JotformEndpointOutputSchemas['user.get'].parse(res);
		expect(parsed.responseCode).toBe(200);
		expect(typeof parsed.content.username).toBe('string');
	});

	it('GET /user/usage returns monthly usage statistics', async () => {
		const res = await makeJotformRequest('/user/usage', LIVE_KEY, {
			method: 'GET',
		});

		const parsed = JotformEndpointOutputSchemas['user.getUsage'].parse(res);
		expect(parsed.responseCode).toBe(200);
		expect(parsed.content).toBeDefined();
	});
});
