import { request } from 'corsair/http';
import {
	encodeQueryFilter,
	makeCosmicReadRequest,
	makeCosmicUploadRequest,
	makeCosmicWriteRequest,
} from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockHttpRequest = request as jest.MockedFunction<typeof request>;

describe('makeCosmicReadRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockHttpRequest.mockResolvedValue({ objects: [], total: 0 });
	});

	it('sends a GET to the Cosmic host with the read key', async () => {
		await makeCosmicReadRequest(
			'/v3/buckets/my-bucket/objects',
			'test-read-key',
			{ type: 'posts', limit: 10 },
		);

		expect(mockHttpRequest).toHaveBeenCalledTimes(1);
		expect(mockHttpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.cosmicjs.com',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v3/buckets/my-bucket/objects',
				query: {
					type: 'posts',
					limit: 10,
					read_key: 'test-read-key',
				},
			}),
		);
	});

	it('omits undefined query values', async () => {
		await makeCosmicReadRequest('/v3/buckets/my-bucket/objects', 'k', {
			type: 'posts',
			sort: undefined,
		});

		const options = mockHttpRequest.mock.calls[0]?.[1];
		expect(options?.query).toEqual({ type: 'posts', read_key: 'k' });
		expect(options?.query).not.toHaveProperty('sort');
	});

	it('propagates ApiError without wrapping', async () => {
		const apiError = new Error('Unauthorized');
		mockHttpRequest.mockRejectedValue(apiError);

		await expect(
			makeCosmicReadRequest('/v3/buckets/b/objects', 'k'),
		).rejects.toBe(apiError);
	});
});

describe('makeCosmicWriteRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockHttpRequest.mockResolvedValue({ object: {} });
	});

	it('sends Bearer auth with a JSON body', async () => {
		await makeCosmicWriteRequest('/v3/buckets/b/objects', 'test-write-key', {
			method: 'POST',
			body: { title: 'Hello', type: 'posts' },
		});

		expect(mockHttpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.cosmicjs.com',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-write-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/v3/buckets/b/objects',
				body: { title: 'Hello', type: 'posts' },
			}),
		);
	});
});

describe('makeCosmicUploadRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockHttpRequest.mockResolvedValue({ media: {} });
	});

	it('posts multipart form data to the workers host', async () => {
		await makeCosmicUploadRequest('/v3/buckets/b/media', 'test-write-key', {
			media: {
				filename: 'pic.png',
				contentType: 'image/png',
				data: new Uint8Array([1, 2, 3]),
			},
			folder: 'album',
			trigger_webhook: true,
		});

		expect(mockHttpRequest).toHaveBeenCalledTimes(1);
		const [config, options] = mockHttpRequest.mock.calls[0] as unknown as [
			{ BASE: string; HEADERS: Record<string, string> },
			{ method: string; body: FormData },
		];
		expect(config.BASE).toBe('https://workers.cosmicjs.com');
		expect(config.HEADERS.Authorization).toBe('Bearer test-write-key');
		expect(options.method).toBe('POST');
		expect(options.body).toBeInstanceOf(FormData);
		expect(options.body.get('folder')).toBe('album');
		expect(options.body.get('write_key')).toBe('test-write-key');
		expect(options.body.get('trigger_webhook')).toBe('true');
		const file = options.body.get('media') as File;
		expect(file.name).toBe('pic.png');
	});
});

describe('encodeQueryFilter', () => {
	it('serializes filter objects to JSON', () => {
		expect(encodeQueryFilter({ type: 'posts', slug: 'hi' })).toBe(
			'{"type":"posts","slug":"hi"}',
		);
	});
});
