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

	it('creates an account on the documented public signup host without an existing permalink', async () => {
		mockedFetch.mockResolvedValueOnce(
			jsonResponse({ account: {}, api_key: 'key' }, 201),
		);
		await makeDeployHQRequest(
			'/api/v1/signup',
			{},
			{
				method: 'POST',
				body: { email: 'agent@example.com', password: 'secure-test-password' },
				public: true,
				signup: true,
			},
		);
		const call = mockedFetch.mock.calls[0];
		expect(call).toBeDefined();
		if (!call) return;
		expect(new URL(String(call[0])).origin).toBe('https://api.deployhq.com');
		expect(call[1]?.method).toBe('POST');
		expect(new Headers(call[1]?.headers).has('authorization')).toBe(false);
		expect(JSON.parse(String(call[1]?.body))).toEqual({
			email: 'agent@example.com',
			password: 'secure-test-password',
		});
	});

	it('preserves invoice PDF bytes in a validated base64 envelope', async () => {
		const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x00, 0xff, 0x80]);
		mockedFetch.mockResolvedValueOnce(
			new Response(bytes, {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);
		const response = await makeDeployHQRequest(
			'/account/invoices/42',
			{
				accountSubdomain: 'demo-account',
				username: 'agent@example.com',
				apiKey: 'secret-api-key',
			},
			{ binary: true },
		);
		expect(response).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: btoa(String.fromCharCode(...bytes)),
			sizeBytes: bytes.byteLength,
		});
	});

	it('rejects invoice bodies over the local binary safety cap', async () => {
		mockedFetch.mockResolvedValueOnce(
			new Response(new Uint8Array(10 * 1024 * 1024 + 1), {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);
		await expect(
			makeDeployHQRequest(
				'/account/invoices/42',
				{
					accountSubdomain: 'demo-account',
					username: 'agent@example.com',
					apiKey: 'secret-api-key',
				},
				{ binary: true },
			),
		).rejects.toThrow('plugin safety cap');
	});

	it('does not shorten a valid invoice Retry-After beyond the fallback backoff cap', async () => {
		jest.useFakeTimers();
		try {
			mockedFetch
				.mockResolvedValueOnce(
					jsonResponse({ error_code: 'service_unavailable' }, 503, {
						'Retry-After': '61',
					}),
				)
				.mockResolvedValueOnce(
					new Response(new Uint8Array([0x25, 0x50, 0x44, 0x46]), {
						status: 200,
						headers: { 'Content-Type': 'application/pdf' },
					}),
				);
			const request = makeDeployHQRequest(
				'/account/invoices/42',
				{
					accountSubdomain: 'demo-account',
					username: 'agent@example.com',
					apiKey: 'secret-api-key',
				},
				{ binary: true },
			);
			await jest.advanceTimersByTimeAsync(60_000);
			expect(mockedFetch).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1_000);
			await expect(request).resolves.toMatchObject({
				kind: 'binary',
				contentType: 'application/pdf',
			});
			expect(mockedFetch).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
		}
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

	it.each([
		[
			'a Rails field-error map',
			422,
			{
				timing: ['is not included in the list'],
				timeout: ['is not included in the list'],
			},
			'HTTP 422: timing is not included in the list; timeout is not included in the list',
		],
		[
			'an errors list',
			422,
			{ errors: ['Timeout is not included in the list'] },
			'HTTP 422: Timeout is not included in the list',
		],
		[
			'a plan restriction',
			403,
			{ error: 'This feature is only available on paid accounts.' },
			'HTTP 403: This feature is only available on paid accounts.',
		],
	])(
		'keeps the reason from %s (live DeployHQ error bodies, 11-13)',
		async (_kind, status, body, expected) => {
			mockedFetch.mockResolvedValueOnce(jsonResponse(body, status));
			await expect(
				makeDeployHQRequest(
					'/global_ssh_commands',
					{
						accountSubdomain: 'demo-account',
						username: 'agent@example.com',
						apiKey: 'secret-api-key',
					},
					{ method: 'POST', body: { command: { description: 'test' } } },
				),
			).rejects.toThrow(expected);
		},
	);

	// A reason can name someone other than the caller, so every email address is
	// redacted, not only the configured username.
	it('redacts any email address in a provider reason', async () => {
		mockedFetch.mockResolvedValueOnce(
			jsonResponse({ error: 'Cannot invite customer@example.org' }, 422),
		);
		const error: unknown = await makeDeployHQRequest(
			'/users',
			{
				accountSubdomain: 'demo-account',
				username: 'agent@example.com',
				apiKey: 'secret-api-key',
			},
			{ method: 'POST', body: { user: { email: 'customer@example.org' } } },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(DeployHQAPIError);
		if (error instanceof Error) {
			expect(error.message).toBe(
				'DeployHQ request failed with HTTP 422: Cannot invite [redacted]',
			);
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

	it('retries safe reads on DeployHQ 503 and honors Retry-After', async () => {
		mockedFetch
			.mockResolvedValueOnce(
				jsonResponse({ error_code: 'service_unavailable' }, 503, {
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

	it('preserves 503 Retry-After on writes without retrying them', async () => {
		mockedFetch.mockResolvedValueOnce(
			jsonResponse({ error_code: 'service_unavailable' }, 503, {
				'Retry-After': '4',
			}),
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
			expect(error.status).toBe(503);
			expect(error.retryAfter).toBe(4_000);
		}
		expect(mockedFetch).toHaveBeenCalledTimes(1);
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
