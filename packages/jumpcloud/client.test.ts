import { AuthMissingError } from 'corsair/core';
import { JumpCloudAPIError, makeJumpCloudRequest } from './client';
import { usersCreate } from './endpoints/users';
import { errorHandlers } from './error-handlers';

// The shared HTTP boundary of this plugin is the client's fetch transport.
const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

// unknown: fixtures intentionally cover every family's documented response
// shapes; the endpoint output schemas, not this helper, enforce the contract.
function jsonResponse(
	body: unknown,
	headers: Record<string, string> = {},
	status = 200,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('makeJumpCloudRequest (mocked fetch transport)', () => {
	it('rejects with AuthMissingError before any request when the api key is missing', async () => {
		await expect(
			makeJumpCloudRequest('', 1, 'GET', '/systemusers'),
		).rejects.toThrow(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('routes v1 requests to the API 1.0 base with the x-api-key header and method', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ results: [] })),
		);

		await makeJumpCloudRequest('jc-key', 1, 'GET', '/systemusers');

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe('https://console.jumpcloud.com/api/systemusers');
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({
			Accept: 'application/json',
			'x-api-key': 'jc-key',
		});
	});

	it('routes v2 requests to the API 2.0 base', async () => {
		fetchMock.mockImplementationOnce(() => Promise.resolve(jsonResponse([])));

		await makeJumpCloudRequest('jc-key', 2, 'GET', '/usergroups');

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe('https://console.jumpcloud.com/api/v2/usergroups');
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-key' });
	});

	it('skips undefined query values and serializes numbers as strings', async () => {
		fetchMock.mockImplementationOnce(() => Promise.resolve(jsonResponse([])));

		await makeJumpCloudRequest('jc-key', 2, 'GET', '/policies', {
			query: { fields: undefined, limit: 10, skip: 20 },
		});

		const [url] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/policies?limit=10&skip=20',
		);
		const parsed = new URL(String(url));
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(parsed.searchParams.get('skip')).toBe('20');
		expect(parsed.searchParams.has('fields')).toBe(false);
	});

	it('serializes the request body as JSON with the application/json content type', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ id: 'p1' })),
		);

		await makeJumpCloudRequest('jc-key', 2, 'POST', '/policies', {
			body: { name: 'Require MFA for admins', template: { id: 'tpl-1' } },
		});

		const init = fetchMock.mock.calls[0]?.[1];
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			name: 'Require MFA for admins',
			template: { id: 'tpl-1' },
		});
	});

	it('resolves an empty 204 response to undefined', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(new Response(null, { status: 204 })),
		);

		const result = await makeJumpCloudRequest(
			'jc-key',
			1,
			'POST',
			'/systemusers/u1/password',
			{ body: { password: 'S3cretValue!' } },
		);

		expect(result).toBeUndefined();
	});

	it('resolves a non-JSON 2xx response to its text (JumpCloud answers text/plain "OK")', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				new Response('ok', {
					status: 200,
					headers: { 'content-type': 'text/plain' },
				}),
			),
		);

		const result = await makeJumpCloudRequest(
			'jc-key',
			1,
			'GET',
			'/systemusers',
		);

		expect(result).toBe('ok');
	});

	it('maps HTTP 429 with a retry-after header onto the error in milliseconds', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				new Response('rate limited', {
					status: 429,
					headers: { 'retry-after': '3' },
				}),
			),
		);

		let caught: JumpCloudAPIError | undefined;
		try {
			await makeJumpCloudRequest('jc-key', 1, 'GET', '/systemusers');
		} catch (error) {
			caught = error as JumpCloudAPIError;
		}

		expect(caught).toBeInstanceOf(JumpCloudAPIError);
		const apiError = caught as JumpCloudAPIError;
		expect(apiError.status).toBe(429);
		expect(apiError.retryAfter).toBe(3000);
	});

	it('throws a JumpCloudAPIError with the HTTP status for a 500 response', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(new Response('boom', { status: 500 })),
		);

		let caught: JumpCloudAPIError | undefined;
		try {
			await makeJumpCloudRequest('jc-key', 1, 'GET', '/systemusers');
		} catch (error) {
			caught = error as JumpCloudAPIError;
		}

		expect(caught).toBeInstanceOf(JumpCloudAPIError);
		const apiError = caught as JumpCloudAPIError;
		expect(apiError.status).toBe(500);
		expect(apiError.retryAfter).toBeUndefined();
	});

	it('keeps provider response body content out of the error message', async () => {
		// JumpCloud error bodies can echo submitted request values, and the
		// default error handler prints error.message, so only the status and
		// no provider-provided text may appear there (R8: customer data stays out of logs).
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				new Response(
					JSON.stringify({
						message: 'email alice@example.com is already registered',
					}),
					{ status: 400, headers: { 'content-type': 'application/json' } },
				),
			),
		);

		let caught: JumpCloudAPIError | undefined;
		try {
			await makeJumpCloudRequest('jc-key', 1, 'POST', '/systemusers', {
				body: { username: 'alice', email: 'alice@example.com' },
			});
		} catch (error) {
			caught = error as JumpCloudAPIError;
		}

		expect(caught).toBeInstanceOf(JumpCloudAPIError);
		const apiError = caught as JumpCloudAPIError;
		expect(apiError.status).toBe(400);
		expect(apiError.message).toBe('JumpCloud API returned 400');
		expect(apiError.message).not.toContain('alice@example.com');
		expect(JSON.stringify(apiError)).not.toContain('alice@example.com');
		expect(apiError).not.toHaveProperty('body');
	});
	it('does not expose customer data from a network failure', async () => {
		fetchMock.mockRejectedValue(new Error('failed for alice@example.com'));
		let caught: Error | undefined;
		try {
			await makeJumpCloudRequest('jc-key', 1, 'GET', '/systemusers');
		} catch (error) {
			caught = error as Error;
		}
		expect(caught?.message).toBe('Failed to reach the JumpCloud API');
		expect(JSON.stringify(caught)).not.toContain('alice@example.com');
	});

	it('does not expose provider details through a user operation or its error handler', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('alice@example.com', {
				status: 400,
				statusText: 'alice@example.com',
			}),
		);
		const log = jest.spyOn(console, 'error').mockImplementation(() => {});
		try {
			let caught: Error | undefined;
			try {
				await usersCreate({ key: 'jc-key' } as never, {
					body: { username: 'alice', email: 'alice@example.com' },
				});
			} catch (error) {
				caught = error as Error;
			}
			expect(caught).toBeInstanceOf(JumpCloudAPIError);
			expect(caught?.message).toBe('JumpCloud API returned 400');
			expect(JSON.stringify(caught)).not.toContain('alice@example.com');
			await errorHandlers.DEFAULT.handler(caught!, {} as never);
			await errorHandlers.DEFAULT.handler(
				new Error('alice@example.com'),
				{} as never,
			);
			expect(JSON.stringify(log.mock.calls)).not.toContain('alice@example.com');
		} finally {
			log.mockRestore();
		}
	});
});

describe('region and multi-tenant organization (account fields)', () => {
	const ORG = '5f0c1b2a3d4e5f6a7b8c9d0e';

	it('sends an EU-region organization to console.eu.jumpcloud.com', async () => {
		fetchMock.mockImplementationOnce(() => Promise.resolve(jsonResponse({})));
		await makeJumpCloudRequest(
			{ key: 'jc-key', keys: { get_region: async () => 'eu' } },
			2,
			'GET',
			'/usergroups',
		);
		expect(String(fetchMock.mock.calls[0]![0])).toBe(
			'https://console.eu.jumpcloud.com/api/v2/usergroups',
		);
	});

	it('reads a pasted console host as its region and lets the option win', async () => {
		fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({})));
		await makeJumpCloudRequest(
			{
				key: 'jc-key',
				keys: { get_region: async () => 'https://console.in.jumpcloud.com/' },
			},
			1,
			'GET',
			'/systemusers',
		);
		await makeJumpCloudRequest(
			{
				key: 'jc-key',
				options: { region: 'us' },
				keys: { get_region: async () => 'eu' },
			},
			1,
			'GET',
			'/systemusers',
		);
		expect(String(fetchMock.mock.calls[0]![0])).toBe(
			'https://console.in.jumpcloud.com/api/systemusers',
		);
		expect(String(fetchMock.mock.calls[1]![0])).toBe(
			'https://console.jumpcloud.com/api/systemusers',
		);
	});

	it('rejects an unknown region before any request, so input never picks the host', async () => {
		await expect(
			makeJumpCloudRequest(
				{ key: 'jc-key', keys: { get_region: async () => 'evil.example.com' } },
				1,
				'GET',
				'/systemusers',
			),
		).rejects.toThrow('Unsupported JumpCloud region');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('falls back to the US host when the tenant has no stored account yet', async () => {
		fetchMock.mockImplementationOnce(() => Promise.resolve(jsonResponse({})));
		await makeJumpCloudRequest(
			{
				key: 'jc-key',
				keys: {
					get_region: async () => {
						throw new Error('No DEK found for account');
					},
				},
			},
			1,
			'GET',
			'/systemusers',
		);
		expect(String(fetchMock.mock.calls[0]![0])).toBe(
			'https://console.jumpcloud.com/api/systemusers',
		);
	});

	it('sends the stored org_id as x-org-id and omits the header without one', async () => {
		fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({})));
		await makeJumpCloudRequest(
			{ key: 'jc-key', keys: { get_org_id: async () => ORG } },
			1,
			'GET',
			'/systemusers',
		);
		await makeJumpCloudRequest({ key: 'jc-key' }, 1, 'GET', '/systemusers');
		expect(fetchMock.mock.calls[0]![1]?.headers).toMatchObject({
			'x-org-id': ORG,
		});
		expect(fetchMock.mock.calls[1]![1]?.headers).not.toHaveProperty('x-org-id');
	});

	it('rejects an organization ID that is not a 24-character hex ID', async () => {
		await expect(
			makeJumpCloudRequest(
				{ key: 'jc-key', options: { orgId: 'abc\r\nx-evil: 1' } },
				1,
				'GET',
				'/systemusers',
			),
		).rejects.toThrow('24-character hex ID');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('response bodies', () => {
	it('cancels an unread error body before throwing', async () => {
		const response = new Response('{"message":"Bad Request"}', {
			status: 400,
			headers: { 'content-type': 'application/json' },
		});
		const cancel = jest.spyOn(response.body!, 'cancel');
		fetchMock.mockImplementationOnce(() => Promise.resolve(response));
		await expect(
			makeJumpCloudRequest('jc-key', 1, 'POST', '/systemusers/u1/unlock'),
		).rejects.toMatchObject({ status: 400 });
		expect(cancel).toHaveBeenCalled();
	});

	it('returns a text/plain body as a string (unlock, resetmfa and mfasync answer "OK")', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				new Response('OK', {
					status: 200,
					headers: { 'content-type': 'text/plain; charset=utf-8' },
				}),
			),
		);
		await expect(
			makeJumpCloudRequest('jc-key', 1, 'POST', '/systemusers/u1/unlock'),
		).resolves.toBe('OK');
	});
});
