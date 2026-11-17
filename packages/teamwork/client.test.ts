import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import * as client from './client';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('Teamwork HTTP client', () => {
	it('passes core ApiError through unchanged, so status and Retry-After stay readable', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects/api/v3/projects.json' },
			{
				url: 'https://acme.teamwork.com/projects/api/v3/projects.json',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'rate limited' },
			},
			'Too Many Requests',
		);
		mockedRequest.mockRejectedValue(apiError);
		await expect(
			client.makeTeamworkRequest({
				apiKey: 'secret-key',
				siteName: 'acme',
				method: 'GET',
				path: '/projects/api/v3/projects.json',
				pathParameters: {},
				query: {},
			}),
		).rejects.toBe(apiError);
	});

	it('uses tenant host, documented route, and Basic API-key authentication', async () => {
		mockedRequest.mockResolvedValue({ projects: [] });
		await client.makeTeamworkRequest({
			apiKey: 'secret-key',
			siteName: 'acme',
			version: 'v3',
			method: 'GET',
			path: '/projects/api/v3/projects.json',
			pathParameters: {},
			query: { page: 2, pageSize: 50 },
		});

		const [config, requestOptions] = mockedRequest.mock.calls[0] ?? [];
		expect(config?.BASE).toBe('https://acme.teamwork.com');
		expect(config?.HEADERS).toEqual(
			expect.objectContaining({
				Authorization: `Basic ${Buffer.from('secret-key:').toString('base64')}`,
			}),
		);
		expect(JSON.stringify(config?.HEADERS)).not.toContain('secret-key');
		expect(requestOptions?.method).toBe('GET');
		expect(requestOptions?.url).toBe('/projects/api/v3/projects.json');
		expect(requestOptions?.query).toEqual({ page: 2, pageSize: 50 });
	});

	it('supports tenant hosts that are supplied as a full Teamwork domain', () => {
		expect(client.resolveTeamworkBaseUrl('ACME.teamwork.com')).toBe(
			'https://acme.teamwork.com',
		);
	});

	it('encodes path values whole, so an id cannot reach another route', () => {
		expect(client.encodeTeamworkPathValue('../people/123')).toBe(
			'..%2Fpeople%2F123',
		);
		expect(client.encodeTeamworkPathValue('42')).toBe('42');
		for (const bad of ['', '.', '..']) {
			expect(() => client.encodeTeamworkPathValue(bad)).toThrow(
				'Invalid Teamwork path value',
			);
		}
	});

	it('sends a traversal id inside its own path segment', async () => {
		const originalFetch = global.fetch;
		const fetchMock = jest.fn().mockResolvedValue(
			new Response('{"STATUS":"OK"}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		global.fetch = fetchMock;
		try {
			const actualHttp =
				jest.requireActual<typeof import('corsair/http')>('corsair/http');
			mockedRequest.mockImplementationOnce(actualHttp.request);
			await client.makeTeamworkRequest({
				apiKey: 'secret-key',
				siteName: 'acme',
				method: 'DELETE',
				path: '/projects/{id}.json',
				pathParameters: { id: '../people/123' },
				query: {},
			});
			const url = String(fetchMock.mock.calls[0]?.[0]);
			expect(url).toBe(
				'https://acme.teamwork.com/projects/..%2Fpeople%2F123.json',
			);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('accepts EU sites and pasted site URLs but keeps the host on teamwork.com', () => {
		expect(client.resolveTeamworkBaseUrl('acme.eu.teamwork.com')).toBe(
			'https://acme.eu.teamwork.com',
		);
		expect(client.resolveTeamworkBaseUrl('acme.eu')).toBe(
			'https://acme.eu.teamwork.com',
		);
		expect(
			client.resolveTeamworkBaseUrl('https://acme.teamwork.com/app/home'),
		).toBe('https://acme.teamwork.com');
		for (const bad of [
			'acme.example.com',
			'http://acme.teamwork.com',
			'acme.teamwork.com.evil.io',
			'acme.us',
		]) {
			expect(() => client.resolveTeamworkBaseUrl(bad)).toThrow(
				'A valid Teamwork site name is required',
			);
		}
	});

	it('encodes comma-separated array filters as one query value on the wire', async () => {
		const originalFetch = global.fetch;
		const fetchMock = jest.fn().mockResolvedValue(
			new Response('{}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		global.fetch = fetchMock;
		try {
			const actualHttp =
				jest.requireActual<typeof import('corsair/http')>('corsair/http');
			await actualHttp.request(
				{
					BASE: 'https://acme.teamwork.com',
					VERSION: 'v3',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
				},
				{
					method: 'GET',
					url: '/projects/api/v3/projects.json',
					query: { projectIds: '1,2' },
				},
			);
		} finally {
			global.fetch = originalFetch;
		}
		const requestUrl = fetchMock.mock.calls[0]?.[0];
		expect(requestUrl).toBeDefined();
		expect(new URL(String(requestUrl)).searchParams.get('projectIds')).toBe(
			'1,2',
		);
	});

	it('rejects empty credentials and invalid site names before transport', async () => {
		await expect(
			client.makeTeamworkRequest({
				apiKey: '',
				siteName: 'acme',
				method: 'GET',
				path: '/projects.json',
				pathParameters: {},
				query: {},
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			client.makeTeamworkRequest({
				apiKey: 'key',
				siteName: 'not a tenant',
				method: 'GET',
				path: '/projects.json',
				pathParameters: {},
				query: {},
			}),
		).rejects.toThrow('A valid Teamwork site name is required');
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('preserves Retry-After from the real Corsair transport without retrying twice', async () => {
		const originalFetch = global.fetch;
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify({ message: 'rate limited' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);
		global.fetch = fetchMock;
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const caught = await actualHttp
			.request(
				{
					BASE: 'https://acme.teamwork.com',
					VERSION: 'v3',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
				},
				{ method: 'GET', url: '/projects/api/v3/projects.json' },
				{
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 0,
						backoffMultiplier: 1,
						headerNames: { retryAfter: 'retry-after' },
					},
				},
			)
			// `unknown` is necessary because Promise rejection values have no static type.
			.catch((error: unknown) => error);
		global.fetch = originalFetch;

		if (!(caught instanceof ApiError)) {
			throw new Error(
				'Expected the Corsair transport to preserve its ApiError',
			);
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(caught.status).toBe(429);
		expect(caught.retryAfter).toBe(4000);
	});
});
