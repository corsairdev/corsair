import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { AzureBlobError, TinypngAPIError } from './client';
import { Account, Images } from './endpoints';
import type { TinypngContext } from './index';
import { tinypng } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = jest.spyOn(global, 'fetch');

const upserts = {
	images: jest.fn(),
	storedOutputs: jest.fn(),
	usage: jest.fn(),
};
const entityClient = (upsert: jest.Mock) => ({
	upsertByEntityId: async (id: string, data: object) => upsert(id, data),
});
const db = {
	images: entityClient(upserts.images),
	storedOutputs: entityClient(upserts.storedOutputs),
	usage: entityClient(upserts.usage),
};
// Safe: endpoints read only key and db from the context, and both are set here.
// A narrower type is not practical because the full context needs the plugin runtime, a database and a keys manager.
const ctx = { key: 'test-key', db } as TinypngContext;
const call = <I, O>(
	endpoint: CorsairEndpoint<TinypngContext, I, O>,
	input: I,
) => endpoint(ctx, input);

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
		// Safe: the client always passes a plain header object; RequestInit.headers is a wider union
		// and narrowing it with a runtime check per assertion is not practical here.
		headers: init?.headers as Record<string, string>,
		redirect: init?.redirect,
		json: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
		body: init?.body,
	};
}

beforeEach(() => {
	fetchMock.mockReset();
	mockLog.mockClear();
	for (const upsert of Object.values(upserts)) upsert.mockClear();
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
		expect(upserts.images).toHaveBeenCalledWith('cciutldm823k9e9r', {
			id: 'cciutldm823k9e9r',
			input: { size: 207565, type: 'image/png' },
			output: {
				size: 30734,
				type: 'image/png',
				width: 530,
				height: 300,
				ratio: 0.148,
			},
			compression_count: 7,
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
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
		expect(sent.body).toEqual(PNG);
	});

	it.each(['not base64!', 'iVBORw', 'data:image/png;base64,iVBORw=='])(
		'rejects malformed base64 %p before calling Tinify',
		async (base64) => {
			await expect(call(Images.shrink, { source: { base64 } })).rejects.toThrow(
				'base64 must be padded standard base64',
			);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('surfaces the Tinify error message and status', async () => {
		respond(
			401,
			JSON.stringify({
				error: 'Unauthorized',
				message: 'Credentials are invalid',
			}),
		);
		// Safe: the caught value is only checked with toBeInstanceOf/toMatchObject below.
		// A narrower type is not practical because a rejection can carry any value.
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

describe('rate limiting', () => {
	it('surfaces 429 with a Retry-After header as a TooManyRequests error', async () => {
		respond(
			429,
			JSON.stringify({
				error: 'TooManyRequests',
				message: 'Your monthly limit has been exceeded',
			}),
			{ 'Retry-After': '30' },
		);

		await expect(
			call(Images.shrink, { source: { url: 'https://example.com/a.png' } }),
		).rejects.toMatchObject({ status: 429, code: 'TooManyRequests' });
		expect(upserts.images).not.toHaveBeenCalled();
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
			service: 's3' as const,
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
		expect(upserts.storedOutputs).toHaveBeenCalledWith(
			'https://s3-us-west-1.amazonaws.com/example-bucket/my-images/optimized.jpg',
			{
				id: 'https://s3-us-west-1.amazonaws.com/example-bucket/my-images/optimized.jpg',
				image_id: '2xnsp7jn34e5',
				service: 's3',
				width: 530,
				height: 300,
			},
		);
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
			redirect: 'error',
			headers: {
				'x-ms-blob-type': 'BlockBlob',
				'Content-Type': 'image/png',
				'x-ms-blob-cache-control': 'public, max-age=31536000',
			},
		});
		expect(put.body).toEqual(PNG);
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
		expect(upserts.storedOutputs).toHaveBeenCalledWith(
			'https://acct.blob.core.windows.net/images/panda.png',
			{
				id: 'https://acct.blob.core.windows.net/images/panda.png',
				image_id: 'cciutldm823k9e9r',
				service: 'azure',
				width: 530,
				height: 300,
				content_type: 'image/png',
				size: 4,
				etag: '"0x8CB171BA9E94B0B"',
			},
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('SECRETSIG');
	});

	it('marks an output failure after shrinking as not retryable', async () => {
		respondShrink();
		respond(
			429,
			JSON.stringify({ error: 'TooManyRequests', message: 'Slow down' }),
		);

		await expect(
			call(Images.compressAndStoreInAzure, {
				source: { url: 'https://tinypng.com/images/panda-happy.png' },
				blobUrl,
			}),
		).rejects.toMatchObject({ status: 429, compressed: true });
		expect(fetchMock).toHaveBeenCalledTimes(2);
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

		// Safe: the caught value is only checked with toBeInstanceOf/toMatchObject below.
		// A narrower type is not practical because a rejection can carry any value.
		const error = await call(Images.compressAndStoreInAzure, {
			source: { url: 'https://tinypng.com/images/panda-happy.png' },
			blobUrl,
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AzureBlobError);
		expect(error).toMatchObject({ status: 403 });
	});

	it.each([
		'http://acct.blob.core.windows.net/images/a.png',
		'https://example.com/upload?sig=x',
		'https://acct.blob.core.windows.net.evil.com/images/a.png',
		'https://169.254.169.254/latest',
	])('rejects a non-Azure blob url %p', async (url) => {
		await expect(
			call(Images.compressAndStoreInAzure, {
				source: { url: 'https://tinypng.com/images/panda-happy.png' },
				blobUrl: url,
			}),
		).rejects.toThrow(
			'blobUrl must be an https://<account>.blob.core.windows.net URL',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts sovereign cloud blob hosts', async () => {
		respondShrink();
		respond(200, PNG, { 'Content-Type': 'image/png' });
		respond(201, '');

		await call(Images.compressAndStoreInAzure, {
			source: { url: 'https://tinypng.com/images/panda-happy.png' },
			blobUrl: 'https://acct.blob.core.usgovcloudapi.net/images/a.png?sig=x',
		});
		expect(request(2).url).toBe(
			'https://acct.blob.core.usgovcloudapi.net/images/a.png?sig=x',
		);
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
		const month = new Date().toISOString().slice(0, 7);
		expect(upserts.usage).toHaveBeenCalledWith(month, {
			id: month,
			compression_count: 42,
		});
	});

	it('reads the count when the monthly limit is reached', async () => {
		respond(
			429,
			JSON.stringify({
				error: 'TooManyRequests',
				message: 'Your monthly limit has been exceeded',
			}),
			{ 'Compression-Count': '500' },
		);
		const result = await call(Account.getCompressionCount, {});

		expect(result).toEqual({ compressionCount: 500 });
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
