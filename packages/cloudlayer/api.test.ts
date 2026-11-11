import { makeCloudlayerRequest } from './client';
import {
	AccountGetOutputSchema,
	AssetsListOutputSchema,
	JobsListOutputSchema,
} from './endpoints/types';

const KEY = process.env.CLOUDLAYER_API_KEY ?? '';
const describeLive = KEY.length > 0 ? describe : describe.skip;

describeLive('Cloudlayer live API (env-gated, read-only)', () => {
	it('GET /v2/account returns documented account usage fields', async () => {
		const response = await makeCloudlayerRequest('/account', KEY, {
			method: 'GET',
		});
		const account = AccountGetOutputSchema.parse(response);

		expect(['limit', 'usage']).toContain(account.subType);
		expect(typeof account.calls).toBe('number');
		expect(typeof account.totalJobs).toBe('number');
	});

	it('GET /v2/assets returns a valid asset list', async () => {
		const response = await makeCloudlayerRequest('/assets', KEY, {
			method: 'GET',
			query: { limit: 1 },
		});
		const assets = AssetsListOutputSchema.parse(response);

		expect(Array.isArray(assets)).toBe(true);
	});

	it('GET /v1/jobs returns a valid legacy jobs list', async () => {
		const response = await makeCloudlayerRequest('/jobs', KEY, {
			method: 'GET',
			apiVersion: 'v1',
			query: { limit: 1 },
		});
		const jobs = JobsListOutputSchema.parse(response);

		expect(Array.isArray(jobs)).toBe(true);
	});

	it('GET /v2/jobs returns a valid v2 jobs list', async () => {
		const response = await makeCloudlayerRequest('/jobs', KEY, {
			method: 'GET',
			apiVersion: 'v2',
			query: { limit: 1 },
		});
		const jobs = JobsListOutputSchema.parse(response);

		expect(Array.isArray(jobs)).toBe(true);
	});
});
