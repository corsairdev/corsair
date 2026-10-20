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

	it('image/edit output parses with null storage fields', async () => {
		const result = await makeClaidAiRequest(
			'image/edit',
			TEST_KEY,
			Out.polishImage,
			{
				method: 'POST',
				body: {
					input:
						'https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png',
					operations: { resizing: { width: 100 } },
				},
			},
		);
		expect(result.data.output).toMatchObject({ width: 100 });
	});
});
