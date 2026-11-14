import { AuthMissingError } from 'corsair/core';
import { JumpCloudAPIError, makeJumpCloudRequest } from './client';

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

	it('resolves a non-JSON 2xx response to undefined', async () => {
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

		expect(result).toBeUndefined();
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

		let caught: unknown;
		try {
			await makeJumpCloudRequest('jc-key', 1, 'GET', '/systemusers');
		} catch (error) {
			caught = error;
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

		let caught: unknown;
		try {
			await makeJumpCloudRequest('jc-key', 1, 'GET', '/systemusers');
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(JumpCloudAPIError);
		const apiError = caught as JumpCloudAPIError;
		expect(apiError.status).toBe(500);
		expect(apiError.retryAfter).toBeUndefined();
	});

	it('keeps provider response body content out of the error message', async () => {
		// JumpCloud error bodies can echo submitted request values, and the
		// default error handler prints error.message, so only the status and
		// reason phrase may appear there (R8: customer data stays out of logs).
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

		let caught: unknown;
		try {
			await makeJumpCloudRequest('jc-key', 1, 'POST', '/systemusers', {
				body: { username: 'alice', email: 'alice@example.com' },
			});
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(JumpCloudAPIError);
		const apiError = caught as JumpCloudAPIError;
		expect(apiError.status).toBe(400);
		expect(apiError.message).toBe('JumpCloud API returned 400');
		expect(apiError.message).not.toContain('alice@example.com');
		// The raw response stays available as structured detail for programmatic
		// use, but nothing prints it.
		expect(apiError.body).toContain('alice@example.com');
	});
});
