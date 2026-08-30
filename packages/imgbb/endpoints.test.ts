import { jest } from '@jest/globals';
import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { Auth, Images } from './endpoints';
import { UploadImageInputSchema } from './endpoints/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

/**
 * Only the transport (`corsair/http`'s `request`) is mocked, so every
 * assertion below exercises the real client: query-param key auth, the
 * multipart form body, and error narrowing via `instanceof ApiError`.
 */
jest.mock('corsair/http', () => {
	class MockApiError extends Error {
		status: number;
		statusText: string;
		body: unknown;
		retryAfter: number | undefined;

		constructor(
			status: number,
			message: string,
			statusText = '',
			body: unknown = undefined,
			retryAfter: number | undefined = undefined,
		) {
			super(message);
			this.name = 'ApiError';
			this.status = status;
			this.statusText = statusText;
			this.body = body;
			this.retryAfter = retryAfter;
		}
	}

	return { ApiError: MockApiError, request: jest.fn() };
});

const requestMock = request as unknown as jest.Mock<
	(config: unknown, options: unknown, extra?: unknown) => Promise<unknown>
>;
const mockLog = logEventFromContext as unknown as jest.Mock<
	() => Promise<void>
>;

const ApiErrorCtor = ApiError as unknown as new (
	status: number,
	message: string,
	statusText?: string,
	body?: unknown,
	retryAfter?: number,
) => Error;

function call(fn: unknown, ctx: unknown, input?: unknown): Promise<unknown> {
	return (fn as (c: unknown, i: unknown) => Promise<unknown>)(ctx, input);
}

function createContext(key = 'abcd1234efgh5678'): unknown {
	return { key, options: { authType: 'api_key' as const } };
}

function lastCall() {
	const invocation = requestMock.mock.calls.at(-1);
	if (!invocation) throw new Error('request was never called');
	return {
		config: invocation[0] as { BASE: string },
		options: invocation[1] as {
			method: string;
			url: string;
			query?: Record<string, unknown>;
			formData?: Record<string, unknown>;
		},
		extra: invocation[2] as
			| { rateLimitConfig?: { maxRetries?: number } }
			| undefined,
	};
}

beforeEach(() => {
	requestMock.mockReset();
	mockLog.mockReset();
});

describe('Auth.getApiKey', () => {
	it('confirms configuration without making a network request', async () => {
		const result = await call(
			Auth.getApiKey,
			createContext('abcd1234efgh5678'),
		);

		expect(result).toEqual({ configured: true, keyPreview: '5678' });
		expect(requestMock).not.toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it('never returns the full key, even when it is short', async () => {
		const result = await call(Auth.getApiKey, createContext('ab'));
		expect(result).toEqual({ configured: true, keyPreview: '**' });
	});
});

describe('Images.upload Input Validation', () => {
	it('accepts valid HTTP and HTTPS URLs', () => {
		expect(
			UploadImageInputSchema.safeParse({
				image: 'https://example.com/photo.png',
			}).success,
		).toBe(true);
		expect(
			UploadImageInputSchema.safeParse({
				image: 'http://example.com/photo.jpg',
			}).success,
		).toBe(true);
	});

	it('accepts valid base64 data URIs', () => {
		expect(
			UploadImageInputSchema.safeParse({
				image:
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
			}).success,
		).toBe(true);
	});

	it('accepts valid raw base64 strings', () => {
		expect(
			UploadImageInputSchema.safeParse({
				image: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
			}).success,
		).toBe(true);
	});

	it('rejects invalid or arbitrary strings and whitespace', () => {
		expect(UploadImageInputSchema.safeParse({ image: '' }).success).toBe(false);
		expect(UploadImageInputSchema.safeParse({ image: '   ' }).success).toBe(
			false,
		);
		expect(
			UploadImageInputSchema.safeParse({ image: 'not a valid image or url!' })
				.success,
		).toBe(false);
	});
});

describe('Images.upload', () => {
	const envelope = {
		data: {
			id: '2ndCYJK',
			title: 'c1f64245afb2',
			url_viewer: 'https://ibb.co/2ndCYJK',
			url: 'https://i.ibb.co/w04Prt6/c1f64245afb2.gif',
			display_url: 'https://i.ibb.co/98W13PY/c1f64245afb2.gif',
			width: '1',
			height: '1',
			size: '42',
			time: '1552042565',
			expiration: '0',
			image: {
				filename: 'c1f64245afb2.gif',
				name: 'c1f64245afb2',
				mime: 'image/gif',
				extension: 'gif',
				url: 'https://i.ibb.co/w04Prt6/c1f64245afb2.gif',
			},
			delete_url: 'https://ibb.co/2ndCYJK/670a7e48ddcb85ac340c717a41047e5c',
		},
		success: true,
		status: 200,
	};

	it('sends the key as a query param and the image as form data', async () => {
		requestMock.mockResolvedValueOnce(envelope);

		const result = await call(Images.upload, createContext('my-key'), {
			image: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
			name: 'my-photo',
		});

		// The response schema coerces ImgBB's stringified numeric fields
		// (width/height/size/time/expiration) to numbers.
		expect(result).toEqual({
			...envelope.data,
			width: 1,
			height: 1,
			size: 42,
			time: 1552042565,
			expiration: 0,
		});

		const { config, options, extra } = lastCall();
		expect(config.BASE).toBe('https://api.imgbb.com');
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/1/upload');
		expect(options.query).toEqual({ key: 'my-key' });
		expect(options.formData).toEqual({
			image: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
			name: 'my-photo',
		});
		expect(extra?.rateLimitConfig?.maxRetries).toBe(0);
	});

	it('forwards Blob, Buffer, and Uint8Array instances through Images.upload', async () => {
		requestMock.mockResolvedValue(envelope);

		const binaryBlob = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], {
			type: 'image/png',
		});
		await call(Images.upload, createContext('my-key'), {
			image: binaryBlob,
			name: 'blob-upload',
		});
		expect(lastCall().options.formData?.image).toBe(binaryBlob);

		const uint8 = new Uint8Array([1, 2, 3, 4]);
		await call(Images.upload, createContext('my-key'), {
			image: uint8,
			name: 'uint8-upload',
		});
		expect(lastCall().options.formData?.image).toBe(uint8);

		const buffer = Buffer.from('fake-image-bytes');
		await call(Images.upload, createContext('my-key'), {
			image: buffer,
			name: 'buffer-upload',
		});
		expect(lastCall().options.formData?.image).toBe(buffer);
	});

	it('passes expiration as a query param when provided', async () => {
		requestMock.mockResolvedValueOnce(envelope);

		await call(Images.upload, createContext('my-key'), {
			image: 'https://example.com/cat.png',
			expiration: 600,
		});

		const { options } = lastCall();
		expect(options.query).toEqual({ key: 'my-key', expiration: 600 });
	});

	it('rejects a malformed response or success: false instead of returning it as-is', async () => {
		requestMock.mockResolvedValueOnce({ success: false, data: envelope.data });

		await expect(
			call(Images.upload, createContext('my-key'), {
				image: 'https://example.com/photo.png',
			}),
		).rejects.toThrow();
	});

	it('wraps a transport ApiError without leaking the raw key', async () => {
		requestMock.mockRejectedValueOnce(
			new ApiErrorCtor(401, 'Unauthorized', 'Unauthorized'),
		);

		try {
			await call(Images.upload, createContext('my-secret-key-12345'), {
				image: 'https://example.com/photo.png',
			});
			fail('Expected Images.upload to throw');
		} catch (err: any) {
			expect(err.message).toMatch(/Unauthorized/);
			expect(err.message).not.toContain('my-secret-key-12345');
		}
	});
});
