import { logEventFromContext } from 'corsair/core';
import { AzureBlobError, TinypngAPIError } from './client';
import { Account, Images } from './endpoints';
import { tinypng } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();
global.fetch = fetchMock as unknown as typeof fetch;

// unknown: endpoints are called with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;
const call = (endpoint: unknown, input: unknown) =>
	(endpoint as AnyEndpoint)({ key: 'test-key' }, input);

const AUTH = `Basic ${Buffer.from('api:test-key').toString('base64')}`;
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);

function respond(
	status: number,
	body: string | Uint8Array,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(new Response(body, { status, headers }));
}

function respondShrink() {
	respond(
		201,
		JSON.stringify({
			input: { size: 207565, type: 'image/png' },
			output: {
				size: 30734,
				type: 'image/png',
				width: 530,
				height: 300,
				ratio: 0.148,
				url: 'https://api.tinify.com/output/cciutldm823k9e9r',
			},
		}),
		{
			'Compression-Count': '7',
			Location: 'https://api.tinify.com/output/cciutldm823k9e9r',
			'Content-Type': 'application/json',
		},
	);
}

function request(n: number) {
	const [url, init] = fetchMock.mock.calls[n] ?? [];
	return {
		url,
		method: init?.method,
		headers: init?.headers as Record<string, string>,
		json: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
		body: init?.body,
	};
}

beforeEach(() => {
	fetchMock.mockReset();
	mockLog.mockClear();
});

describe('tinypng plugin', () => {
	it('registers every corsair.dev operation and no webhooks', () => {
		const plugin = tinypng({ key: 'k' });
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual([
			'account.getCompressionCount',
			'images.compressAndStoreInAzure',
			'images.output',
			'images.shrink',
			'images.transform',
		]);
	});
});

describe('images.shrink', () => {
	it('posts a source url and returns the image id from Location', async () => {
		respondShrink();
		const result = await call(Images.shrink, {
			source: { url: 'https://tinypng.com/images/panda-happy.png' },
		});

		expect(request(0)).toMatchObject({
			url: 'https://api.tinify.com/shrink',
			method: 'POST',
			headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
			json: { source: { url: 'https://tinypng.com/images/panda-happy.png' } },
		});
		expect(result).toEqual({
			imageId: 'cciutldm823k9e9r',
			outputUrl: 'https://api.tinify.com/output/cciutldm823k9e9r',
			compressionCount: 7,
			input: { size: 207565, type: 'image/png' },
			output: {
				size: 30734,
				type: 'image/png',
				width: 530,
				height: 300,
				ratio: 0.148,
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			{ key: 'test-key' },
			'tinypng.images.shrink',
			expect.objectContaining({ imageId: 'cciutldm823k9e9r' }),
			'completed',
		);
	});

	it('uploads base64 input as raw bytes', async () => {
		respondShrink();
		await call(Images.shrink, {
			source: { base64: Buffer.from(PNG).toString('base64') },
		});

		const sent = request(0);
		expect(sent.headers['Content-Type']).toBeUndefined();
		expect(Array.from(sent.body as Uint8Array)).toEqual(Array.from(PNG));
	});

	it('surfaces the Tinify error message and status', async () => {
		respond(
			401,
			JSON.stringify({
				error: 'Unauthorized',
				message: 'Credentials are invalid',
			}),
		);
		const error = await call(Images.shrink, {
			source: { url: 'https://example.com/a.png' },
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(TinypngAPIError);
		expect(error).toMatchObject({
			message: 'Credentials are invalid',
			status: 401,
			code: 'Unauthorized',
		});
	});
});

describe('images.output', () => {
	it('downloads the compressed image as base64 with its dimensions', async () => {
		respond(200, PNG, {
			'Content-Type': 'image/png',
			'Image-Width': '530',
			'Image-Height': '300',
			'Compression-Count': '7',
		});
		const result = await call(Images.output, { imageId: '2xnsp7jn34e5' });

		expect(request(0)).toMatchObject({
			url: 'https://api.tinify.com/output/2xnsp7jn34e5',
			method: 'GET',
		});
		expect(request(0).body).toBeUndefined();
		expect(result).toEqual({
			imageId: '2xnsp7jn34e5',
			contentType: 'image/png',
			size: 4,
			width: 530,
			height: 300,
			compressionCount: 7,
			base64: 'iVBORw==',
		});
	});

	it('rejects an image id that is not a Tinify output id', async () => {
		await expect(call(Images.output, { imageId: '../shrink' })).rejects.toThrow(
			'imageId must be the id from a shrink response',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('images.transform', () => {
	it('posts resize and convert options and returns the new image', async () => {
		respond(200, PNG, {
			'Content-Type': 'image/webp',
			'Image-Width': '150',
			'Image-Height': '85',
			'Compression-Count': '9',
		});
		const result = await call(Images.transform, {
			imageId: '2xnsp7jn34e5',
			resize: { method: 'fit', width: 150, height: 100 },
			convert: { type: 'image/webp' },
			preserve: ['copyright'],
		});

		expect(request(0)).toMatchObject({
			url: 'https://api.tinify.com/output/2xnsp7jn34e5',
			method: 'POST',
			json: {
				resize: { method: 'fit', width: 150, height: 100 },
				convert: { type: 'image/webp' },
				preserve: ['copyright'],
			},
		});
		expect(result).toEqual({
			stored: false,
			imageId: '2xnsp7jn34e5',
			contentType: 'image/webp',
			size: 4,
			width: 150,
			height: 85,
			compressionCount: 9,
			base64: 'iVBORw==',
		});
	});

	it('stores to S3 and returns the storage location without logging keys', async () => {
		respond(200, '', {
			Location:
				'https://s3-us-west-1.amazonaws.com/example-bucket/my-images/optimized.jpg',
			'Image-Width': '530',
			'Image-Height': '300',
			'Compression-Count': '3',
		});
		const store = {
			service: 's3',
			aws_access_key_id: 'AKIAEXAMPLE',
			aws_secret_access_key: 'secret',
			region: 'us-west-1',
			path: 'example-bucket/my-images/optimized.jpg',
		};
		const result = await call(Images.transform, {
			imageId: '2xnsp7jn34e5',
			store,
		});

		expect(request(0).json).toEqual({ store });
		expect(result).toEqual({
			stored: true,
			imageId: '2xnsp7jn34e5',
			location:
				'https://s3-us-west-1.amazonaws.com/example-bucket/my-images/optimized.jpg',
			width: 530,
			height: 300,
			compressionCount: 3,
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('secret');
	});

	it('requires at least one transformation', async () => {
		await expect(
			call(Images.transform, { imageId: '2xnsp7jn34e5' }),
		).rejects.toThrow('Provide at least one of resize');
	});

	it('rejects scale with both width and height', async () => {
		await expect(
			call(Images.transform, {
				imageId: '2xnsp7jn34e5',
				resize: { method: 'scale', width: 100, height: 100 },
			}),
		).rejects.toThrow('scale takes exactly one of width or height');
	});
});

describe('images.compressAndStoreInAzure', () => {
	const blobUrl =
		'https://acct.blob.core.windows.net/images/panda.png?sv=2022-11-02&sig=SECRETSIG';

	it('shrinks, downloads, and puts the result as a block blob', async () => {
		respondShrink();
		respond(200, PNG, {
			'Content-Type': 'image/png',
			'Image-Width': '530',
			'Image-Height': '300',
			'Compression-Count': '7',
		});
		respond(201, '', { ETag: '"0x8CB171BA9E94B0B"' });

		const result = await call(Images.compressAndStoreInAzure, {
			source: { url: 'https://tinypng.com/images/panda-happy.png' },
			blobUrl,
			cacheControl: 'public, max-age=31536000',
		});

		expect(request(1)).toMatchObject({
			url: 'https://api.tinify.com/output/cciutldm823k9e9r',
			method: 'GET',
		});
		const put = request(2);
		expect(put).toMatchObject({
			url: blobUrl,
			method: 'PUT',
			headers: {
				'x-ms-blob-type': 'BlockBlob',
				'Content-Type': 'image/png',
				'x-ms-blob-cache-control': 'public, max-age=31536000',
			},
		});
		expect(Array.from(put.body as Uint8Array)).toEqual(Array.from(PNG));
		expect(result).toEqual({
			imageId: 'cciutldm823k9e9r',
			blobUrl: 'https://acct.blob.core.windows.net/images/panda.png',
			contentType: 'image/png',
			size: 4,
			width: 530,
			height: 300,
			compressionCount: 7,
			etag: '"0x8CB171BA9E94B0B"',
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('SECRETSIG');
	});

	it('converts through POST /output when options are given', async () => {
		respondShrink();
		respond(200, PNG, { 'Content-Type': 'image/webp' });
		respond(201, '');

		await call(Images.compressAndStoreInAzure, {
			source: { url: 'https://tinypng.com/images/panda-happy.png' },
			blobUrl,
			convert: { type: 'image/webp' },
		});

		expect(request(1)).toMatchObject({
			method: 'POST',
			json: { convert: { type: 'image/webp' } },
		});
		expect(request(2).headers['Content-Type']).toBe('image/webp');
	});

	it('reports an Azure rejection as AzureBlobError', async () => {
		respondShrink();
		respond(200, PNG, { 'Content-Type': 'image/png' });
		respond(403, 'AuthenticationFailed');

		const error = await call(Images.compressAndStoreInAzure, {
			source: { url: 'https://tinypng.com/images/panda-happy.png' },
			blobUrl,
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AzureBlobError);
		expect(error).toMatchObject({ status: 403 });
	});

	it('rejects a non-https blob url', async () => {
		await expect(
			call(Images.compressAndStoreInAzure, {
				source: { url: 'https://tinypng.com/images/panda-happy.png' },
				blobUrl: 'http://acct.blob.core.windows.net/images/a.png',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account.getCompressionCount', () => {
	it('reads Compression-Count from the empty shrink probe', async () => {
		respond(
			400,
			JSON.stringify({ error: 'InputMissing', message: 'Input missing' }),
			{ 'Compression-Count': '42' },
		);
		const result = await call(Account.getCompressionCount, {});

		expect(request(0)).toMatchObject({
			url: 'https://api.tinify.com/shrink',
			method: 'POST',
		});
		expect(request(0).body).toBeUndefined();
		expect(result).toEqual({ compressionCount: 42 });
	});

	it('still fails on an invalid key', async () => {
		respond(
			401,
			JSON.stringify({
				error: 'Unauthorized',
				message: 'Credentials are invalid',
			}),
		);
		await expect(call(Account.getCompressionCount, {})).rejects.toMatchObject({
			status: 401,
		});
	});
});
