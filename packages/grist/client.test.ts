import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	DEFAULT_GRIST_API_BASE,
	GristAPIError,
	makeGristRequest,
	normalizeGristBaseUrl,
	redactValue,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function buildApiError(
	status: number,
	message: string,
	retryAfter?: number,
	reqBody?: unknown,
	resBody?: unknown,
) {
	return new ApiError(
		// unknown because request body may be any arbitrary JSON payload
		{
			method: 'POST',
			url: '/docs/doc123/tables/Table1/records',
			body: reqBody,
			headers: { Authorization: 'Bearer secret-key-xyz' },
		},
		{
			url: 'https://docs.getgrist.com/api/docs/doc123/tables/Table1/records',
			ok: false,
			status,
			statusText: message,
			body: resBody,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('normalizeGristBaseUrl', () => {
	it('returns default URL when undefined or empty', () => {
		expect(normalizeGristBaseUrl()).toBe(DEFAULT_GRIST_API_BASE);
		expect(normalizeGristBaseUrl('')).toBe(DEFAULT_GRIST_API_BASE);
		expect(normalizeGristBaseUrl('   ')).toBe(DEFAULT_GRIST_API_BASE);
	});

	it('trims trailing slashes', () => {
		expect(normalizeGristBaseUrl('https://docs.getgrist.com/api/')).toBe(
			'https://docs.getgrist.com/api',
		);
		expect(normalizeGristBaseUrl('https://docs.getgrist.com/api///')).toBe(
			'https://docs.getgrist.com/api',
		);
	});

	it('appends /api suffix if not present', () => {
		expect(normalizeGristBaseUrl('https://myteam.getgrist.com')).toBe(
			'https://myteam.getgrist.com/api',
		);
		expect(normalizeGristBaseUrl('https://myteam.getgrist.com/')).toBe(
			'https://myteam.getgrist.com/api',
		);
	});

	it('preserves existing /api in custom domains', () => {
		expect(normalizeGristBaseUrl('https://myteam.getgrist.com/api')).toBe(
			'https://myteam.getgrist.com/api',
		);
	});
});

describe('redactValue helper', () => {
	it('redacts sensitive string substrings', () => {
		expect(redactValue('token is secret-123', ['secret-123'])).toBe(
			'token is [REDACTED]',
		);
	});

	it('redacts sensitive keys in recursive objects', () => {
		const payload = {
			apiKey: 'secret1',
			nested: {
				password: 'pass',
				token_secret: 'tok',
				safe: 'value',
			},
			list: [{ authorization: 'Bearer abc' }],
		};
		const redacted = redactValue(payload, ['secret1']) as Record<
			string,
			unknown
		>;
		expect(redacted.apiKey).toBe('[REDACTED]');
		expect((redacted.nested as Record<string, unknown>).password).toBe(
			'[REDACTED]',
		);
		expect((redacted.nested as Record<string, unknown>).token_secret).toBe(
			'[REDACTED]',
		);
		expect((redacted.nested as Record<string, unknown>).safe).toBe('value');
		expect(
			(
				(redacted.list as Array<Record<string, unknown>>)[0] as Record<
					string,
					unknown
				>
			).authorization,
		).toBe('[REDACTED]');
	});
});

describe('makeGristRequest', () => {
	it('sends Authorization: Bearer <apiKey> header and Content-Type', async () => {
		mockRequest.mockResolvedValue({ id: 'doc123' });

		await makeGristRequest('/docs', 'my-api-key', {
			method: 'POST',
			body: { documentName: 'Test' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: DEFAULT_GRIST_API_BASE,
			HEADERS: {
				Authorization: 'Bearer my-api-key',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/docs',
			body: { documentName: 'Test' },
		});
	});

	it('supports custom baseUrl for team sites', async () => {
		mockRequest.mockResolvedValue([]);

		await makeGristRequest('/orgs', 'my-api-key', {
			method: 'GET',
			baseUrl: 'https://myteam.getgrist.com',
		});

		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://myteam.getgrist.com/api',
		});
	});

	it('throws AuthMissingError when key is empty without calling network', async () => {
		mockRequest.mockResolvedValue({});

		// unknown because rejection value has no static type; assertions narrow it
		const err = await makeGristRequest('/orgs', '', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(err).toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when key is undefined without calling network', async () => {
		// unknown because rejection value has no static type; assertions narrow it
		const err = await makeGristRequest('/orgs', undefined, {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(err).toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('redacts credentials in-place from ApiError request and body', async () => {
		const rawError = buildApiError(
			400,
			'Invalid key my-secret-token in request',
			undefined,
			{ apiKey: 'my-secret-token', data: 'ok' },
			{ error: 'failed with my-secret-token' },
		);
		mockRequest.mockRejectedValue(rawError);

		// unknown because rejection value has no static type; assertions narrow it
		const caught = await makeGristRequest('/orgs', 'my-secret-token', {
			method: 'GET',
		}).catch((err: unknown) => err);

		// Preserves exact ApiError instance and prototype
		expect(caught).toBe(rawError);
		expect(caught).toBeInstanceOf(ApiError);
		expect((caught as ApiError).status).toBe(400);

		// Redactions in-place
		expect((caught as ApiError).message).toContain('[REDACTED]');
		expect((caught as ApiError).message).not.toContain('my-secret-token');

		const reqBody = (caught as ApiError).request.body as Record<
			string,
			unknown
		>;
		expect(reqBody.apiKey).toBe('[REDACTED]');
		expect(reqBody.data).toBe('ok');

		const reqHeaders = (caught as ApiError).request.headers as Record<
			string,
			unknown
		>;
		expect(reqHeaders.Authorization).toBe('[REDACTED]');

		const resBody = (caught as ApiError).body as Record<string, unknown>;
		expect(resBody.error).toBe('failed with [REDACTED]');
	});

	it('wraps generic Error in GristAPIError and redacts API key from message', async () => {
		mockRequest.mockRejectedValue(
			new Error('Connection failed with key test-key-999'),
		);

		// unknown because rejection value has no static type; assertions narrow it
		const caught = await makeGristRequest('/orgs', 'test-key-999', {
			method: 'GET',
		}).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(GristAPIError);
		expect((caught as Error).message).toContain('[REDACTED]');
		expect((caught as Error).message).not.toContain('test-key-999');
	});

	it('tests real transport rate limiting using actual corsair request', async () => {
		const actualHttp = jest.requireActual('corsair/http');
		const globalFetchBackup = global.fetch;

		const mockFetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({
				'retry-after': '4',
				'content-type': 'application/json',
			}),
			text: async () => JSON.stringify({ error: 'rate limited' }),
			json: async () => ({ error: 'rate limited' }),
		});
		global.fetch = mockFetch as typeof global.fetch;

		try {
			// unknown because rejection value has no static type; assertions narrow it
			const caught = await actualHttp
				.request(
					{
						BASE: 'https://docs.getgrist.com/api',
						VERSION: '1.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: { Authorization: 'Bearer test' },
					},
					{
						method: 'GET',
						url: '/orgs',
					},
				)
				.catch((e: unknown) => e);

			expect(caught).toBeInstanceOf(ApiError);
			expect((caught as ApiError).status).toBe(429);
			expect((caught as ApiError).retryAfter).toBe(4000);
		} finally {
			global.fetch = globalFetchBackup;
		}
	});
});
