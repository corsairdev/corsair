import { jest } from '@jest/globals';
import { uploadImageToImgBB } from './client';
import { Auth, Images } from './endpoints';
import {
	GetApiKeyResponseSchema,
	UploadImageResponseSchema,
} from './endpoints/types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core') as object;
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined as never),
	};
});

const TEST_API_KEY = process.env.IMGBB_API_KEY;

function createTestContext(key: string) {
	return {
		key,
		options: { authType: 'api_key' as const },
	} as any;
}

describe('ImgBB Live API & Client Integration Tests', () => {
	const maybeTest = TEST_API_KEY ? it : it.skip;

	maybeTest('executes live image upload with public URL', async () => {
		const result = await uploadImageToImgBB<{
			data: unknown;
			success: boolean;
			status: number;
		}>({
			apiKey: TEST_API_KEY!,
			image: 'https://picsum.photos/100/100.jpg',
			name: 'corsair_live_test_url',
		});

		expect(result.success).toBe(true);
		expect(result.status).toBe(200);

		const parsed = UploadImageResponseSchema.parse(result.data);
		expect(parsed.id).toBeTruthy();
		expect(parsed.url).toBeTruthy();
		expect(parsed.display_url).toBeTruthy();
	});

	maybeTest(
		'executes live image upload through Images.upload endpoint',
		async () => {
			const ctx = createTestContext(TEST_API_KEY!);

			const uploaded = await Images.upload(ctx, {
				image: 'https://picsum.photos/120/120.jpg',
				name: 'corsair_endpoint_test',
				expiration: 600,
			});

			expect(uploaded.id).toBeTruthy();
			expect(uploaded.url).toContain('ibb.co');
			expect(uploaded.expiration).toBe(600);
		},
	);

	it('validates auth.getApiKey schema structure', async () => {
		const ctx = createTestContext('live_test_dummy_key_12345678');

		const res = await Auth.getApiKey(ctx, {});
		const parsed = GetApiKeyResponseSchema.parse(res);
		expect(parsed.configured).toBe(true);
		expect(parsed.keyPreview).toBe('5678');
	});
});
