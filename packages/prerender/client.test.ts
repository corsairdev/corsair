import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	isCredentialRejection,
	isReplayablePath,
	makePrerenderRequest,
	PRERENDER_API_BASE,
	PrerenderAPIError,
	readReason,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

/**
 * An ApiError carrying Prerender's plain-text rejection. The body is a string,
 * which is what the real API sends.
 */
function textError(status: number, body: string, path = '/recache') {
	return new ApiError(
		{ method: 'POST', url: path },
		{
			url: `${PRERENDER_API_BASE}${path}`,
			ok: false,
			status,
			statusText: body,
			body,
		},
		body,
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Prerender error body', () => {
	it('reads the plain text reason rather than expecting JSON', () => {
		expect(readReason('Invalid prerenderToken')).toBe('Invalid prerenderToken');
	});

	it('returns undefined for a body that is not text', () => {
		// A proxy can answer JSON or HTML; neither should be stringified into a
		// misleading reason.
		expect(readReason({ msg: 'nope' })).toBeUndefined();
		expect(readReason(undefined)).toBeUndefined();
	});

	it('ignores an oversized body rather than logging an HTML page', () => {
		expect(readReason(`<html>${'x'.repeat(400)}</html>`)).toBeUndefined();
	});

	it('treats the documented token rejection as an auth failure', () => {
		expect(isCredentialRejection(400, 'Invalid prerenderToken')).toBe(true);
		expect(isCredentialRejection(401, 'Invalid prerenderToken')).toBe(true);
	});

	it('does not treat a 403 as an auth failure, since it means a clear is running', () => {
		expect(isCredentialRejection(403, 'Cache clear in progress')).toBe(false);
	});

	it('does not treat an unrelated 400 as an auth failure', () => {
		expect(isCredentialRejection(400, 'Invalid url')).toBe(false);
	});
});

describe('isReplayablePath', () => {
	it('allows the reads and the speed change to repeat', () => {
		expect(isReplayablePath('/search')).toBe(true);
		expect(isReplayablePath('/cache-clear-status/[REDACTED]')).toBe(true);
		expect(isReplayablePath('/change-recache-speed')).toBe(true);
		expect(isReplayablePath(`${PRERENDER_API_BASE}/search`)).toBe(true);
	});

	it('keeps render-spending and deleting routes from repeating', () => {
		expect(isReplayablePath('/recache')).toBe(false);
		expect(isReplayablePath('/sitemap')).toBe(false);
		expect(isReplayablePath('/cache-clear')).toBe(false);
		expect(isReplayablePath(undefined)).toBe(false);
	});
});

describe('makePrerenderRequest', () => {
	it('sends the token in the X-Prerender-Token header and leaves the body alone', async () => {
		mockRequest.mockResolvedValue({ message: 'ok' });

		await makePrerenderRequest('test-token', {
			method: 'POST',
			path: '/recache',
			body: { url: 'https://example.com/' },
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: PRERENDER_API_BASE,
			HEADERS: { 'X-Prerender-Token': 'test-token' },
		});
		expect(options).toEqual({
			method: 'POST',
			url: '/recache',
			// Core copies these options onto an ApiError, so no token may be here.
			body: { url: 'https://example.com/' },
			mediaType: 'application/json',
		});
	});

	it('sends no body on a GET', async () => {
		mockRequest.mockResolvedValue('not queued');

		await makePrerenderRequest('test-token', {
			method: 'GET',
			path: '/cache-clear-status/test-token',
		});

		const options = mockRequest.mock.calls[0]?.[1];
		expect(options?.body).toBeUndefined();
		expect(options?.mediaType).toBeUndefined();
	});

	it('throws AuthMissingError without a request when the token is blank', async () => {
		await expect(
			makePrerenderRequest('  ', {
				method: 'POST',
				path: '/recache',
				body: {},
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses a token carrying a newline, which would break the header', async () => {
		await expect(
			makePrerenderRequest('token\nInjected: 1', {
				method: 'POST',
				path: '/recache',
				body: {},
			}),
		).rejects.toThrow(/must not contain newlines/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it("lets core's ApiError through unchanged, with Prerender's text reason", async () => {
		const rejection = textError(400, 'Invalid prerenderToken');
		mockRequest.mockRejectedValue(rejection);

		const error = await captureError(
			makePrerenderRequest('secret-token', {
				method: 'POST',
				path: '/recache',
				body: { url: 'https://example.com/' },
			}),
		);

		// Core forwards an ApiError's status and body to the caller; any other
		// error class becomes a bare "Internal error".
		expect(error).toBe(rejection);
		expect(error).toMatchObject({
			status: 400,
			body: 'Invalid prerenderToken',
		});
		expect(JSON.stringify(error)).not.toContain('secret-token');
	});

	it('keeps a 403 as an ApiError, which is a state rather than a failure', async () => {
		mockRequest.mockRejectedValue(textError(403, 'Cache clear in progress'));

		const error = await captureError(
			makePrerenderRequest('token', {
				method: 'POST',
				path: '/cache-clear',
				body: { query: 'https://example.com%' },
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 403 });
	});

	it('masks the token on an ApiError from the status route, which has it in the path', async () => {
		mockRequest.mockRejectedValue(
			textError(500, 'Upstream error', '/cache-clear-status/secret-token'),
		);

		const error = await captureError(
			makePrerenderRequest('secret-token', {
				method: 'GET',
				path: '/cache-clear-status/secret-token',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 500,
			body: 'Upstream error',
			url: `${PRERENDER_API_BASE}/cache-clear-status/[REDACTED]`,
		});
		expect(JSON.stringify(error)).not.toContain('secret-token');
	});

	it('drops the sent body, which can hold customer URLs, from an ApiError', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/search',
					body: { exactMatch: 'https://example.com/u/jane@example.com' },
				},
				{
					url: `${PRERENDER_API_BASE}/search`,
					ok: false,
					status: 503,
					statusText: 'Service Unavailable',
					body: 'Service Unavailable',
				},
				'Service Unavailable',
				{ retryAfter: 30 },
			),
		);

		const error = await captureError(
			makePrerenderRequest('token', {
				method: 'POST',
				path: '/search',
				body: { exactMatch: 'https://example.com/u/jane@example.com' },
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 503, retryAfter: 30 });
		expect(JSON.stringify(error)).not.toContain('jane@example.com');
	});

	it('only strips the exact API origin when matching replayable paths', () => {
		expect(isReplayablePath(`${PRERENDER_API_BASE}/search`)).toBe(true);
		expect(isReplayablePath(`${PRERENDER_API_BASE}.evil.example/search`)).toBe(
			false,
		);
	});

	it('flags a dropped connection as transport, replayable only on a read', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const write = await captureError(
			makePrerenderRequest('token', { method: 'POST', path: '/recache' }),
		);
		const read = await captureError(
			makePrerenderRequest('token', { method: 'POST', path: '/search' }),
		);

		expect(write).toBeInstanceOf(PrerenderAPIError);
		expect(write).toMatchObject({
			transport: true,
			method: 'POST',
			replayable: false,
		});
		expect(read).toMatchObject({ transport: true, replayable: true });
	});
});
