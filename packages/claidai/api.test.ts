import 'dotenv/config';
import { makeClaidAiRequest } from './client';
import { ClaidAiEndpointOutputSchemas as Out } from './endpoints/types';

const TEST_KEY = process.env.CLAIDAI_API_KEY ?? '';

const describeLive = TEST_KEY ? describe : describe.skip;

describeLive('Claid.ai live API', () => {
	it('storageTypes returns the supported connector types', async () => {
		const result = await makeClaidAiRequest(
			'storage/storage-types',
			TEST_KEY,
			Out.storageTypes,
		);
		expect(result.data).toEqual(expect.arrayContaining(['s3', 'gcs']));
	});

	it('storageList returns connected storages', async () => {
		const result = await makeClaidAiRequest(
			'storage/storages',
			TEST_KEY,
			Out.storageList,
		);
		expect(Array.isArray(result.data)).toBe(true);
	});
});
