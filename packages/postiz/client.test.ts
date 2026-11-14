import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	describePostizError,
	makePostizRequest,
	normalizePostizBaseUrl,
	POSTIZ_API_BASE,
	PostizAPIError,
	readErrorLabel,
	resolvePostizBaseUrl,
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

	it("lets core's ApiError through, with Postiz's own reason in the message", async () => {
		const rejected = apiError(400, { msg: 'Integration not found' });
		mockRequest.mockRejectedValue(rejected);

		const error = await captureError(
			makePostizRequest('secret-key', {
				method: 'GET',
				path: '/integrations',
			}),
		);

		// The same instance, so status, Retry-After and the body survive.
		expect(error).toBe(rejected);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(400);
		expect(error.message).toBe('Postiz 400: Integration not found');
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

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
		expect(error.request.method).toBe('POST');
	});

	it("does not override core's 429 retries", async () => {
		mockRequest.mockResolvedValue([]);

		await makePostizRequest('key', { method: 'GET', path: '/integrations' });

		expect(mockRequest.mock.calls[0]?.[2]).toBeUndefined();
	});

	it('sends to a self-hosted base when one is given', async () => {
		mockRequest.mockResolvedValue([]);

		await makePostizRequest(
			'key',
			{ method: 'GET', path: '/integrations' },
			'https://postiz.example.com/api/public/v1',
		);

		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://postiz.example.com/api/public/v1',
		});
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

describe('base URL', () => {
	it('uses Postiz Cloud when nothing is set', async () => {
		expect(normalizePostizBaseUrl(undefined)).toBe(POSTIZ_API_BASE);
		expect(normalizePostizBaseUrl('  ')).toBe(POSTIZ_API_BASE);
		await expect(resolvePostizBaseUrl({})).resolves.toBe(POSTIZ_API_BASE);
	});

	it('adds the public API path to a self-hosted origin', () => {
		expect(normalizePostizBaseUrl('https://postiz.example.com')).toBe(
			'https://postiz.example.com/api/public/v1',
		);
		expect(normalizePostizBaseUrl('https://postiz.example.com/')).toBe(
			'https://postiz.example.com/api/public/v1',
		);
		expect(
			normalizePostizBaseUrl('https://postiz.example.com/api/public/v1/'),
		).toBe('https://postiz.example.com/api/public/v1');
	});

	it('maps the cloud hosts to the cloud API base', () => {
		expect(normalizePostizBaseUrl('https://api.postiz.com')).toBe(
			POSTIZ_API_BASE,
		);
		expect(normalizePostizBaseUrl('https://platform.postiz.com')).toBe(
			POSTIZ_API_BASE,
		);
	});

	it('refuses a URL the key should not be sent to', () => {
		expect(() => normalizePostizBaseUrl('http://postiz.example.com')).toThrow(
			/https/,
		);
		expect(() => normalizePostizBaseUrl('postiz.example.com')).toThrow(
			/absolute/,
		);
		expect(() =>
			normalizePostizBaseUrl('https://user:pw@postiz.example.com'),
		).toThrow(/credentials/);
		expect(() =>
			normalizePostizBaseUrl('https://postiz.example.com/?next=evil'),
		).toThrow(/query/);
	});

	it('prefers the baseUrl option over the stored account field', async () => {
		const keys = {
			get_base_url: () => Promise.resolve('https://stored.example.com'),
		};
		await expect(resolvePostizBaseUrl({ keys })).resolves.toBe(
			'https://stored.example.com/api/public/v1',
		);
		await expect(
			resolvePostizBaseUrl({
				options: { baseUrl: 'https://option.example.com' },
				keys,
			}),
		).resolves.toBe('https://option.example.com/api/public/v1');
	});
});
