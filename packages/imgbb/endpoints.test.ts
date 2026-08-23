import { jest } from '@jest/globals';
import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { Auth, Images } from './endpoints';

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
	(config: unknown, options: unknown) => Promise<unknown>
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
			image: 'base64data==',
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

		const { config, options } = lastCall();
		expect(config.BASE).toBe('https://api.imgbb.com');
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/1/upload');
		expect(options.query).toEqual({ key: 'my-key' });
		expect(options.formData).toEqual({
			image: 'base64data==',
			name: 'my-photo',
		});
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

	it('rejects a malformed response instead of returning it as-is', async () => {
		requestMock.mockResolvedValueOnce({ success: false });

		await expect(
			call(Images.upload, createContext('my-key'), {
				image: 'base64data==',
			}),
		).rejects.toThrow();
	});

	it('wraps a transport ApiError without leaking the raw key', async () => {
		requestMock.mockRejectedValueOnce(
			new ApiErrorCtor(401, 'Unauthorized', 'Unauthorized'),
		);

		await expect(
			call(Images.upload, createContext('my-secret-key'), {
				image: 'base64data==',
			}),
		).rejects.toThrow(/Unauthorized/);
	});
});
