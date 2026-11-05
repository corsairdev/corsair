import { makeDatarobotRequest } from './client';
import { DatarobotListSchema } from './endpoints/types';

const apiKey = process.env.DATAROBOT_API_KEY ?? '';
const baseUrl = process.env.DATAROBOT_BASE_URL ?? 'https://app.datarobot.com';
const describeLive = apiKey ? describe : describe.skip;

describeLive('DataRobot live API', () => {
	it('reads /api/v2/version/', async () => {
		const body = await makeDatarobotRequest<unknown>('/api/v2/version/', {
			key: apiKey,
			options: { baseUrl },
		});
		expect(body).toEqual(expect.any(Object));
	});

	it('lists projects', async () => {
		const body = await makeDatarobotRequest<unknown>(
			'/api/v2/projects/',
			{
				key: apiKey,
				options: { baseUrl },
			},
			{
				query: { offset: 0, limit: 2 },
			},
		);
		expect(DatarobotListSchema.parse(body)).toEqual(expect.any(Object));
	});

	it('lists datasets', async () => {
		const body = await makeDatarobotRequest<unknown>(
			'/api/v2/datasets/',
			{
				key: apiKey,
				options: { baseUrl },
			},
			{
				query: { offset: 0, limit: 2 },
			},
		);
		expect(body).toEqual(expect.any(Object));
	});

	it('lists deployments', async () => {
		const body = await makeDatarobotRequest<unknown>(
			'/api/v2/deployments/',
			{ key: apiKey, options: { baseUrl } },
			{ query: { offset: 0, limit: 2 } },
		);
		expect(body).toEqual(expect.any(Object));
	});

	it('lists use cases', async () => {
		const body = await makeDatarobotRequest<unknown>(
			'/api/v2/useCases/',
			{
				key: apiKey,
				options: { baseUrl },
			},
			{
				query: { offset: 0, limit: 2 },
			},
		);
		expect(body).toEqual(expect.any(Object));
	});

	it.each([
		'/api/v2/status/',
		'/api/v2/predictionServers/',
		'/api/v2/credentials/',
		'/api/v2/catalogItems/',
		'/api/v2/batchPredictions/',
		'/api/v2/customModels/',
		'/api/v2/modelPackages/',
	])('lists %s', async (path) => {
		const body = await makeDatarobotRequest<unknown>(
			path,
			{ key: apiKey, options: { baseUrl } },
			{ query: { offset: 0, limit: 2 } },
		);
		expect(body).toEqual(expect.any(Object));
	});
});
