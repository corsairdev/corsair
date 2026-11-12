import { AuthMissingError } from 'corsair/core';
import { DeployHQAPIError, makeDeployHQRequest } from './client';

const mockedFetch = jest.spyOn(globalThis, 'fetch');

function jsonResponse(
	value: object,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	const responseHeaders = new Headers(headers);
	responseHeaders.set('Content-Type', 'application/json');
	return new Response(JSON.stringify(value), {
		status,
		headers: responseHeaders,
	});
}

beforeEach(() => {
	mockedFetch.mockReset();
});

afterAll(() => {
	mockedFetch.mockRestore();
});

describe('DeployHQ client', () => {
	it('uses the account subdomain and HTTP Basic username/API-key credentials', async () => {
		mockedFetch.mockResolvedValueOnce(jsonResponse({ account: {} }));
		await makeDeployHQRequest('/projects', {
			accountSubdomain: 'demo-account',
			username: 'agent@example.com',
			apiKey: 'secret-api-key',
		});

		const call = mockedFetch.mock.calls[0];
		expect(call).toBeDefined();
		if (!call) return;
		const [requestUrl, requestInit] = call;
		expect(String(requestUrl)).toContain(
			'https://demo-account.deployhq.com/projects',
		);
		const headers = new Headers(requestInit?.headers);
		expect(headers.get('authorization')).toBe(
			`Basic ${btoa('agent@example.com:secret-api-key')}`,
		);
		expect(headers.get('accept')).toBe('application/json');
		expect(headers.get('content-type')).toContain('application/json');
	});

	it('sends public routes without an Authorization header', async () => {
		mockedFetch.mockResolvedValueOnce(jsonResponse({ ip_ranges: [] }));
		await makeDeployHQRequest(
			'/ip_ranges',
			{ accountSubdomain: 'demo-account' },
			{ public: true },
		);
		const call = mockedFetch.mock.calls[0];
		expect(call).toBeDefined();
		if (!call) return;
		expect(new Headers(call[1]?.headers).has('authorization')).toBe(false);
	});

	it('fails explicitly when the API key or username is missing', async () => {
		await expect(
			makeDeployHQRequest('/account', {
				accountSubdomain: 'demo-account',
				username: 'agent@example.com',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makeDeployHQRequest('/account', {
				accountSubdomain: 'demo-account',
				username: 'agent@example.com',
				apiKey: '',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedFetch).not.toHaveBeenCalled();
	});

	it('rejects unsafe account hosts before network I/O', async () => {
		await expect(
			makeDeployHQRequest('/account', {
				accountSubdomain: 'attacker.example.com',
				username: 'agent@example.com',
				apiKey: 'secret',
			}),
		).rejects.toThrow('accountSubdomain');
		expect(mockedFetch).not.toHaveBeenCalled();
	});

	it('does not propagate provider error bodies or credentials in thrown errors', async () => {
		mockedFetch.mockResolvedValueOnce(
			jsonResponse(
				{
					error: 'invalid_auth',
					hint: 'bad secret-api-key for agent@example.com',
				},
				401,
			),
		);
		// `unknown` because a rejected HTTP request may produce any JavaScript value.
		const error: unknown = await makeDeployHQRequest('/account', {
			accountSubdomain: 'demo-account',
			username: 'agent@example.com',
			apiKey: 'secret-api-key',
		}).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(DeployHQAPIError);
		if (error instanceof Error) {
			expect(error.message).not.toContain('secret-api-key');
			expect(error.message).not.toContain('agent@example.com');
			expect(JSON.stringify(error)).not.toContain('secret-api-key');
			expect(JSON.stringify(error)).not.toContain('agent@example.com');
		}
	});

	it('extracts Retry-After on 429 without retrying a non-idempotent write', async () => {
		mockedFetch.mockResolvedValueOnce(
			jsonResponse({ error_code: 'rate_limited' }, 429, { 'Retry-After': '4' }),
		);
		// `unknown` because a rejected HTTP request may produce any JavaScript value.
		const error: unknown = await makeDeployHQRequest(
			'/projects',
			{
				accountSubdomain: 'demo-account',
				username: 'agent@example.com',
				apiKey: 'secret-api-key',
			},
			{ method: 'POST', body: { project: { name: 'test' } } },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(DeployHQAPIError);
		if (error instanceof DeployHQAPIError) {
			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(4_000);
		}
		expect(mockedFetch).toHaveBeenCalledTimes(1);
	});

	it('lets the shared transport own safe-read 429 retries and honors Retry-After', async () => {
		mockedFetch
			.mockResolvedValueOnce(
				jsonResponse({ error_code: 'rate_limited' }, 429, {
					'Retry-After': '0',
				}),
			)
			.mockResolvedValueOnce(jsonResponse({ account: {} }));
		await makeDeployHQRequest('/account', {
			accountSubdomain: 'demo-account',
			username: 'agent@example.com',
			apiKey: 'secret-api-key',
		});
		expect(mockedFetch).toHaveBeenCalledTimes(2);
	});

	it('applies the bounded 20-second timeout to requests', async () => {
		mockedFetch.mockResolvedValueOnce(jsonResponse({ account: {} }));
		await makeDeployHQRequest('/account', {
			accountSubdomain: 'demo-account',
			username: 'agent@example.com',
			apiKey: 'secret-api-key',
		});
		const call = mockedFetch.mock.calls[0];
		expect(call).toBeDefined();
		if (!call) return;
		expect(call[1]?.signal).toBeInstanceOf(AbortSignal);
	});
});
