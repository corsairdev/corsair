import 'dotenv/config';
import { makeClaidAiRequest } from './client';
import { ClaidAiEndpointOutputSchemas } from './endpoints/types';

// Non-null is safe here: describeLive skips the suite when the key is missing.
const TEST_KEY = process.env.CLAIDAI_API_KEY!;

const describeLive = process.env.CLAIDAI_API_KEY ? describe : describe.skip;

describeLive('Claid.ai live API', () => {
	it('storageTypes returns supported types', async () => {
		const response = await makeClaidAiRequest<{
			data: Array<'web_folder' | 's3' | 'gcs'>;
		}>('storage/storage-types', TEST_KEY, { method: 'GET' });
		const parsed = ClaidAiEndpointOutputSchemas.storageTypes.parse(response);
		expect(parsed).toBeDefined();
		expect(parsed.data).toBeDefined();
		expect(Array.isArray(parsed.data)).toBe(true);
		expect(parsed.data?.length).toBeGreaterThan(0);
		expect(parsed.data).toContain('s3');
	});

	it('storageList returns connected storages', async () => {
		// Unknown is safe here: the raw payload is immediately validated below.
		const response = await makeClaidAiRequest<unknown>(
			'storage/storages',
			TEST_KEY,
			{ method: 'GET' },
		);
		const parsed = ClaidAiEndpointOutputSchemas.storageList.parse(response);
		expect(parsed).toBeDefined();
		expect(parsed.data).toBeDefined();
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
