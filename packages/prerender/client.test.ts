import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	describePrerenderError,
	isCredentialRejection,
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
function textError(status: number, body: string) {
	return new ApiError(
		{ method: 'POST', url: '/recache' },
		{
			url: `${PRERENDER_API_BASE}/recache`,
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
		expect(
			describePrerenderError(400, 'Invalid prerenderToken', 'fallback'),
		).toBe('Prerender 400: Invalid prerenderToken');
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

describe('makePrerenderRequest', () => {
	it('adds the token to the JSON body of a POST', async () => {
		mockRequest.mockResolvedValue({ message: 'ok' });

		await makePrerenderRequest('test-token', {
			method: 'POST',
			path: '/recache',
			body: { url: 'https://example.com/' },
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({ BASE: PRERENDER_API_BASE });
		expect(options).toMatchObject({
			method: 'POST',
			url: '/recache',
			// The token rides in the body on every route that takes one.
			body: { url: 'https://example.com/', prerenderToken: 'test-token' },
			mediaType: 'application/json',
		});
	});

	it('sends no body on a GET, so no token is duplicated into it', async () => {
		mockRequest.mockResolvedValue({ message: 'not queued' });

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

	it('refuses a token carrying a newline, which would break the request', async () => {
		await expect(
			makePrerenderRequest('token\nInjected: 1', {
				method: 'POST',
				path: '/recache',
				body: {},
			}),
		).rejects.toThrow(/must not contain newlines/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reports a rejected token as a credential failure without echoing it', async () => {
		mockRequest.mockRejectedValue(textError(400, 'Invalid prerenderToken'));

		const error = await captureError(
			makePrerenderRequest('secret-token', {
				method: 'POST',
				path: '/recache',
				body: { url: 'https://example.com/' },
			}),
		);

		expect(error).toBeInstanceOf(PrerenderAPIError);
		if (!(error instanceof PrerenderAPIError)) return;
		expect(error.status).toBe(400);
		expect(error.reason).toBe('Invalid prerenderToken');
		expect(error.credentialsRejected).toBe(true);
		expect(error.method).toBe('POST');
		// The token rides in the body, so nothing on the error may repeat it.
		expect(JSON.stringify(error)).not.toContain('secret-token');
	});

	it('keeps a 403 with its reason, which is a state rather than a failure', async () => {
		mockRequest.mockRejectedValue(textError(403, 'Cache clear in progress'));

		const error = await captureError(
			makePrerenderRequest('token', {
				method: 'POST',
				path: '/cache-clear',
				body: { query: 'https://example.com%' },
			}),
		);

		expect(error).toBeInstanceOf(PrerenderAPIError);
		if (!(error instanceof PrerenderAPIError)) return;
		expect(error.status).toBe(403);
		expect(error.reason).toBe('Cache clear in progress');
		expect(error.credentialsRejected).toBe(false);
	});

	it('flags a dropped connection as a transport failure with its method', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makePrerenderRequest('token', { method: 'POST', path: '/recache' }),
		);

		expect(error).toBeInstanceOf(PrerenderAPIError);
		if (!(error instanceof PrerenderAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.method).toBe('POST');
	});
});
