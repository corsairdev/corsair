import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	describePostizError,
	isCredentialRejection,
	makePostizRequest,
	POSTIZ_API_BASE,
	PostizAPIError,
	readErrorLabel,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

/** An ApiError carrying one of Postiz's two error shapes. */
function apiError(
	status: number,
	body: Record<string, unknown>, // unknown: Postiz's error body, read by key.
) {
	return new ApiError(
		{ method: 'GET', url: '/integrations' },
		{
			url: `${POSTIZ_API_BASE}/integrations`,
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		String(body.msg ?? body.message ?? 'error'),
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Postiz error body', () => {
	it('reads the short `{ msg }` shape Postiz sends for a bad key', () => {
		expect(
			describePostizError(401, { msg: 'Invalid API key' }, 'fallback'),
		).toBe('Postiz 401: Invalid API key');
	});

	it('reads the NestJS shape a missing route gets', () => {
		const body = {
			message: 'Cannot GET /public/v1/nope',
			error: 'Not Found',
			statusCode: 404,
		};

		expect(readErrorLabel(body)).toBe('Not Found');
		expect(describePostizError(404, body, 'fallback')).toBe(
			'Postiz 404 Not Found: Cannot GET /public/v1/nope',
		);
	});

	it('flags both documented key rejections', () => {
		expect(isCredentialRejection(401, { msg: 'No API Key found' })).toBe(true);
		expect(isCredentialRejection(401, { msg: 'Invalid API key' })).toBe(true);
	});

	it('does not flag a 403, which is a key without access rather than a bad key', () => {
		expect(
			isCredentialRejection(403, { msg: 'You do not own this resource' }),
		).toBe(false);
	});

	it('does not flag a 400 that happens to mention a key', () => {
		expect(isCredentialRejection(400, { msg: 'api key not needed here' })).toBe(
			false,
		);
	});
});

describe('makePostizRequest', () => {
	it('sends the raw key in the Authorization header, with no scheme', async () => {
		mockRequest.mockResolvedValue([]);

		await makePostizRequest('test-key', {
			method: 'GET',
			path: '/integrations',
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: POSTIZ_API_BASE,
			HEADERS: { Authorization: 'test-key', Accept: 'application/json' },
		});
		expect(options).toMatchObject({ method: 'GET', url: '/integrations' });
	});

	it('throws AuthMissingError without a request when the key is blank', async () => {
		await expect(
			makePostizRequest('  ', { method: 'GET', path: '/integrations' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses a key carrying a newline, which would break the header', async () => {
		await expect(
			makePostizRequest('key\nX-Injected: 1', {
				method: 'GET',
				path: '/integrations',
			}),
		).rejects.toThrow(/must not contain newlines/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reports a rejected key as a credential failure without echoing it', async () => {
		mockRequest.mockRejectedValue(apiError(401, { msg: 'Invalid API key' }));

		const error = await captureError(
			makePostizRequest('secret-key', {
				method: 'GET',
				path: '/integrations',
			}),
		);

		expect(error).toBeInstanceOf(PostizAPIError);
		if (!(error instanceof PostizAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.credentialsRejected).toBe(true);
		expect(error.method).toBe('GET');
		// The key rides in a header, so nothing on the error may repeat it.
		expect(JSON.stringify(error)).not.toContain('secret-key');
	});

	it('keeps status and Retry-After on a rate limit', async () => {
		const rateLimited = new ApiError(
			{ method: 'POST', url: '/posts' },
			{
				url: `${POSTIZ_API_BASE}/posts`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Too Many Requests', statusCode: 429 },
			},
			'Too Many Requests',
			{ retryAfter: 3000 },
		);
		mockRequest.mockRejectedValue(rateLimited);

		const error = await captureError(
			makePostizRequest('key', {
				method: 'POST',
				path: '/posts',
				body: { type: 'now' },
			}),
		);

		expect(error).toBeInstanceOf(PostizAPIError);
		if (!(error instanceof PostizAPIError)) return;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
		expect(error.method).toBe('POST');
	});

	it('flags a dropped connection as a transport failure with its method', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makePostizRequest('key', { method: 'POST', path: '/posts' }),
		);

		expect(error).toBeInstanceOf(PostizAPIError);
		if (!(error instanceof PostizAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.method).toBe('POST');
	});
});
