import { request } from 'corsair/http';
import {
	DRIVE_API_BASE,
	fetchDriveBytes,
	GoogleSlidesExportError,
	makeDriveRequest,
	makeSlidesRequest,
	runBatchUpdate,
	SLIDES_API_BASE,
} from './client';
import { captureError, makeContext } from './test-helpers';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request configuration', () => {
	it('sends the token as a bearer header, never in the url', async () => {
		await makeSlidesRequest(
			'/presentations',
			makeContext({ key: 'secret-token' }),
		);

		const [config] = mockRequest.mock.calls[0];
		expect(config.TOKEN).toBe('secret-token');
		expect(config.BASE).toBe(SLIDES_API_BASE);
		expect(config.WITH_CREDENTIALS).toBe(false);
	});

	it('routes Drive calls to the Drive host and Slides calls to the Slides host', async () => {
		await makeSlidesRequest('/presentations', makeContext());
		await makeDriveRequest('/files', makeContext());

		expect(mockRequest.mock.calls[0][0].BASE).toBe(SLIDES_API_BASE);
		expect(mockRequest.mock.calls[1][0].BASE).toBe(DRIVE_API_BASE);
	});

	it('disables transport retries so error-handlers.ts is the only retry layer', async () => {
		await makeSlidesRequest('/presentations', makeContext());

		// A second layer multiplies: the default 3 here under the handler's 4
		// measured 20 requests for a single call.
		const [, , requestOptions] = mockRequest.mock.calls[0];
		expect(requestOptions.rateLimitConfig).toEqual({
			maxRetries: 0,
			enabled: true,
			initialRetryDelay: 1000,
			backoffMultiplier: 2,
			headerNames: { retryAfter: 'retry-after' },
		});
	});

	it('keeps headerNames so a 429 can still report Retry-After', async () => {
		await makeSlidesRequest('/presentations', makeContext());

		const [, , requestOptions] = mockRequest.mock.calls[0];
		// A partial object replaces the defaults wholesale; without this key the
		// first 429 throws a TypeError while reading retryAfter.
		expect(requestOptions.rateLimitConfig.headerNames).toBeDefined();
		expect(requestOptions.rateLimitConfig.enabled).toBe(true);
	});

	it('sends a body only for write methods', async () => {
		await makeSlidesRequest('/presentations', makeContext(), {
			method: 'POST',
			body: { title: 'x' },
		});
		await makeSlidesRequest('/presentations/a', makeContext(), {
			method: 'GET',
		});

		expect(mockRequest.mock.calls[0][1].body).toEqual({ title: 'x' });
		expect(mockRequest.mock.calls[1][1].body).toBeUndefined();
	});

	it('sets a TIMEOUT only when one is requested', async () => {
		await makeSlidesRequest('/presentations', makeContext());
		await makeSlidesRequest('/presentations', makeContext(), {
			timeout: 60_000,
		});

		expect(mockRequest.mock.calls[0][0]).not.toHaveProperty('TIMEOUT');
		expect(mockRequest.mock.calls[1][0].TIMEOUT).toBe(60_000);
	});

	it('passes dotted query keys through unchanged', async () => {
		await makeSlidesRequest('/thumbnail', makeContext(), {
			query: { 'thumbnailProperties.thumbnailSize': 'LARGE' },
		});

		// corsair/http renders a nested object as key[sub], which Google ignores.
		expect(mockRequest.mock.calls[0][1].query).toEqual({
			'thumbnailProperties.thumbnailSize': 'LARGE',
		});
	});
});

describe('401 handling', () => {
	it('refreshes once and replays with the new token', async () => {
		const { ApiError } = jest.requireActual('corsair/http');
		mockRequest
			.mockRejectedValueOnce(
				new ApiError(
					{ method: 'GET', url: '/presentations' },
					{
						url: `${SLIDES_API_BASE}/presentations`,
						ok: false,
						status: 401,
						statusText: 'Unauthorized',
						body: {},
					},
					'Unauthorized',
				),
			)
			.mockResolvedValueOnce({ presentationId: 'deck-1' });

		const refreshAuth = jest.fn(async () => 'fresh-token');
		const result = await makeSlidesRequest(
			'/presentations',
			makeContext({ refreshAuth }),
		);

		expect(refreshAuth).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[1][0].TOKEN).toBe('fresh-token');
		expect(result).toEqual({ presentationId: 'deck-1' });
	});

	it('does not retry a 401 without a refresh callback', async () => {
		mockRequest.mockRejectedValue(
			new (jest.requireActual('corsair/http').ApiError)(
				{ method: 'GET', url: '/presentations' },
				{
					url: `${SLIDES_API_BASE}/presentations`,
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: {},
				},
				'Unauthorized',
			),
		);

		await expect(
			makeSlidesRequest('/presentations', makeContext()),
		).rejects.toMatchObject({ status: 401 });
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('does not refresh for a non-401 failure', async () => {
		mockRequest.mockRejectedValue(
			new (jest.requireActual('corsair/http').ApiError)(
				{ method: 'GET', url: '/presentations' },
				{
					url: `${SLIDES_API_BASE}/presentations`,
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					body: {},
				},
				'Bad Request',
			),
		);

		const refreshAuth = jest.fn(async () => 'fresh-token');
		await expect(
			makeSlidesRequest('/presentations', makeContext({ refreshAuth })),
		).rejects.toMatchObject({ status: 400 });
		expect(refreshAuth).not.toHaveBeenCalled();
	});
});

describe('runBatchUpdate', () => {
	it('posts requests and includes writeControl only when given one', async () => {
		await runBatchUpdate(makeContext(), 'deck-1', [
			{ deleteObject: { objectId: 'a' } },
		]);
		await runBatchUpdate(
			makeContext(),
			'deck-1',
			[{ deleteObject: { objectId: 'a' } }],
			{ requiredRevisionId: 'rev-1' },
		);

		expect(mockRequest.mock.calls[0][1].url).toBe(
			'/presentations/deck-1:batchUpdate',
		);
		expect(mockRequest.mock.calls[0][1].body).toEqual({
			requests: [{ deleteObject: { objectId: 'a' } }],
		});
		expect(mockRequest.mock.calls[1][1].body).toEqual({
			requests: [{ deleteObject: { objectId: 'a' } }],
			writeControl: { requiredRevisionId: 'rev-1' },
		});
	});

	it('encodes the presentation id in the path', async () => {
		await runBatchUpdate(makeContext(), 'a/b', []);

		expect(mockRequest.mock.calls[0][1].url).toBe(
			'/presentations/a%2Fb:batchUpdate',
		);
	});
});

describe('fetchDriveBytes', () => {
	it('returns the bytes and the content type', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('bytes', {
				status: 200,
				headers: { 'content-type': 'application/pdf; charset=binary' },
			}),
		);

		const result = await fetchDriveBytes(makeContext(), '/files/a/export', {
			accept: 'application/pdf',
		});

		expect(result.buffer.toString()).toBe('bytes');
		expect(result.contentType).toBe('application/pdf; charset=binary');
	});

	it('wraps a transport failure in the plugin error type so a retry can see it', async () => {
		jest.spyOn(global, 'fetch').mockRejectedValue(new Error('socket hang up'));

		const error = await captureError(
			fetchDriveBytes(makeContext(), '/files/a/export', {
				accept: 'application/pdf',
			}),
		);

		// A raw error would reach DEFAULT and never match EXPORT_ERROR.
		expect(error).toBeInstanceOf(GoogleSlidesExportError);
		expect((error as Error).message).toContain('socket hang up');
	});

	it('wraps a body read failure too, not only the request', async () => {
		const response = new Response('x', { status: 200 });
		jest
			.spyOn(response, 'arrayBuffer')
			.mockRejectedValue(new Error('stream cut'));
		jest.spyOn(global, 'fetch').mockResolvedValue(response);

		const error = await captureError(
			fetchDriveBytes(makeContext(), '/files/a/export', {
				accept: 'application/pdf',
			}),
		);

		expect(error).toBeInstanceOf(GoogleSlidesExportError);
		expect((error as Error).message).toContain('stream cut');
	});

	it('keeps the status on an http failure', async () => {
		jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('nope', { status: 500 }));

		const error = (await captureError(
			fetchDriveBytes(makeContext(), '/files/a/export', {
				accept: 'application/pdf',
			}),
		)) as GoogleSlidesExportError;

		expect(error.status).toBe(500);
	});
});
