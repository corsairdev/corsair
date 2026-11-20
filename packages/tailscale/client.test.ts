import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	buildUrl,
	clearTailscaleTokenCache,
	encodeTailscalePathValue,
	forgetTailscaleToken,
	makeTailscaleRawRequest,
	mediaTypeFor,
	oauthClientIdFrom,
	TAILSCALE_TOKEN_URL,
	tailscaleBearer,
	tailscaleErrorMessage,
	withoutQuery,
	withoutRequestData,
} from './client';

const SECRET = 'tskey-client-kAbC123CNTRL-SuperSecretValue42';

const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'content-type': 'application/json' },
		...init,
	});
}

beforeEach(() => {
	fetchMock.mockReset();
	global.fetch = fetchMock as unknown as typeof fetch;
	clearTailscaleTokenCache();
	jest.useRealTimers();
});

describe('credentials', () => {
	it('reads the client ID out of an OAuth client secret, and nothing else', () => {
		expect(oauthClientIdFrom(SECRET)).toBe('kAbC123CNTRL');
		expect(oauthClientIdFrom('tskey-api-kAbC123CNTRL-abc')).toBeUndefined();
		expect(oauthClientIdFrom('tskey-auth-kAbC123CNTRL-abc')).toBeUndefined();
		expect(oauthClientIdFrom('not a key')).toBeUndefined();
	});

	it('sends an API access token as it is, without an exchange', async () => {
		await expect(tailscaleBearer('tskey-api-k1-abc')).resolves.toBe(
			'tskey-api-k1-abc',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses an empty key before any request', async () => {
		await expect(tailscaleBearer('')).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('exchanges an OAuth client secret once and reuses the token', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				access_token: 'tskey-api-minted',
				token_type: 'Bearer',
				expires_in: 3600,
			}),
		);
		const [first, second] = await Promise.all([
			tailscaleBearer(SECRET),
			tailscaleBearer(SECRET),
		]);
		expect(first).toBe('tskey-api-minted');
		expect(second).toBe('tskey-api-minted');
		await expect(tailscaleBearer(SECRET)).resolves.toBe('tskey-api-minted');
		expect(fetchMock).toHaveBeenCalledTimes(1);

		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(url).toBe(TAILSCALE_TOKEN_URL);
		expect(init?.method).toBe('POST');
		const form = new URLSearchParams(String(init?.body));
		expect(form.get('client_id')).toBe('kAbC123CNTRL');
		expect(form.get('client_secret')).toBe(SECRET);
		expect(form.get('grant_type')).toBe('client_credentials');
	});

	it('gets a new token five minutes before the old one runs out, and after a 401', async () => {
		jest.useFakeTimers({ now: new Date('2026-11-20T00:00:00Z') });
		fetchMock
			.mockResolvedValueOnce(
				jsonResponse({ access_token: 'tskey-api-one', expires_in: 3600 }),
			)
			.mockResolvedValueOnce(
				jsonResponse({ access_token: 'tskey-api-two', expires_in: 3600 }),
			)
			.mockResolvedValueOnce(
				jsonResponse({ access_token: 'tskey-api-three', expires_in: 3600 }),
			);
		await expect(tailscaleBearer(SECRET)).resolves.toBe('tskey-api-one');
		jest.setSystemTime(new Date('2026-11-20T00:54:00Z'));
		await expect(tailscaleBearer(SECRET)).resolves.toBe('tskey-api-one');
		jest.setSystemTime(new Date('2026-11-20T00:56:00Z'));
		await expect(tailscaleBearer(SECRET)).resolves.toBe('tskey-api-two');
		await forgetTailscaleToken(SECRET);
		await expect(tailscaleBearer(SECRET)).resolves.toBe('tskey-api-three');
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it('reports a refused exchange with its status and reason, never the secret', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{ message: 'invalid client credentials' },
				{ status: 401, statusText: 'Unauthorized' },
			),
		);
		const error = await tailscaleBearer(SECRET).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect((error as ApiError).message).toMatch(/invalid client credentials/);
		expect(JSON.stringify(error)).not.toContain('SuperSecretValue42');
		expect((error as ApiError).message).not.toContain('SuperSecretValue42');
	});

	it('fails an exchange that returns no token', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ token_type: 'Bearer' }));
		await expect(tailscaleBearer(SECRET)).rejects.toThrow('no access token');
	});
});

describe('URLs and bodies', () => {
	it('encodes path values and refuses ones that would change the route', () => {
		expect(encodeTailscalePathValue('svc:mcp')).toBe('svc%3Amcp');
		expect(encodeTailscalePathValue('a/b')).toBe('a%2Fb');
		for (const value of ['', '.', '..']) {
			expect(() => encodeTailscalePathValue(value)).toThrow(
				'Invalid Tailscale path value',
			);
		}
	});

	it('builds the URL core builds: repeated keys for lists', () => {
		expect(
			buildUrl({
				token: 't',
				method: 'GET',
				path: '/tailnet/{tailnet}/devices',
				pathParameters: { tailnet: '-' },
				query: {
					tags: ['tag:a', 'tag:b'],
					isEphemeral: true,
					missing: undefined,
				},
			}),
		).toBe(
			'https://api.tailscale.com/api/v2/tailnet/-/devices?tags=tag%3Aa&tags=tag%3Ab&isEphemeral=true',
		);
	});

	it('sends HuJSON text as application/hujson and the rest as JSON', () => {
		expect(mediaTypeFor('{ // c\n}')).toBe('application/hujson');
		expect(mediaTypeFor({ acls: [] })).toMatch(/^application\/json/);
		expect(mediaTypeFor([{ role: 'member' }])).toMatch(/^application\/json/);
		expect(mediaTypeFor(undefined)).toBeUndefined();
	});
});

describe('the raw transport for the policy file', () => {
	const request = {
		token: 'tskey-api-test',
		method: 'POST' as const,
		path: '/tailnet/{tailnet}/acl',
		pathParameters: { tailnet: '-' },
		headers: { 'If-Match': '"e1"', Accept: 'application/hujson' },
		body: '{ // rules\n}',
	};

	it('keeps the ETag header and sends the text as is', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{ // rules\n}', { status: 200, headers: { etag: '"e2"' } }),
		);
		const result = await makeTailscaleRawRequest(request);
		expect(result.text).toBe('{ // rules\n}');
		expect(result.headers.get('etag')).toBe('"e2"');
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(url).toBe('https://api.tailscale.com/api/v2/tailnet/-/acl');
		expect(init?.body).toBe('{ // rules\n}');
		const headers = init?.headers as Record<string, string>;
		expect(headers.Authorization).toBe('Bearer tskey-api-test');
		expect(headers['Content-Type']).toBe('application/hujson');
		expect(headers['If-Match']).toBe('"e1"');
	});

	it('retries a 429 after Retry-After, then succeeds', async () => {
		jest.useFakeTimers();
		fetchMock
			.mockResolvedValueOnce(
				new Response('', { status: 429, headers: { 'retry-after': '1' } }),
			)
			.mockResolvedValueOnce(new Response('{}', { status: 200 }));
		const pending = makeTailscaleRawRequest(request);
		await jest.advanceTimersByTimeAsync(1000);
		await expect(pending).resolves.toEqual(
			expect.objectContaining({ text: '{}' }),
		);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('raises an ApiError with the status, without the policy it sent', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{ message: 'precondition failed, invalid old hash' },
				{ status: 412, statusText: 'Precondition Failed' },
			),
		);
		const error = (await makeTailscaleRawRequest(request).catch(
			(e: unknown) => e,
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(412);
		expect(error.message).toBe(
			'Tailscale 412: precondition failed, invalid old hash',
		);
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
	});
});

describe('errors', () => {
	function apiError(
		body: unknown,
		request: Record<string, unknown> = {},
	): ApiError {
		return new ApiError(
			{ method: 'POST', url: '/tailnet/{tailnet}/keys', ...request },
			{
				url: 'https://api.tailscale.com/api/v2/tailnet/-/devices?hostname=dave-laptop',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body,
			},
			'Bad Request',
			{ retryAfter: 5 },
		);
	}

	it("puts Tailscale's reason in the message, with failing ACL tests", () => {
		expect(
			tailscaleErrorMessage(400, 'Bad Request', {
				message: 'invalid tag "tag:x"',
			}),
		).toBe('Tailscale 400: invalid tag "tag:x"');
		expect(
			tailscaleErrorMessage(400, 'Bad Request', {
				message: 'test(s) failed',
				data: [{ user: 'a', errors: ['want: Accept, got: Drop'] }],
			}),
		).toBe('Tailscale 400: test(s) failed (want: Accept, got: Drop)');
		expect(tailscaleErrorMessage(502, 'Bad Gateway', 'upstream down')).toBe(
			'Tailscale 502: upstream down',
		);
		expect(tailscaleErrorMessage(500, '', {})).toBe(
			'Tailscale 500: request failed',
		);
		expect(
			tailscaleErrorMessage(400, '', { message: 'x'.repeat(600) }),
		).toHaveLength(500);
	});

	it('drops the sent body, headers and query values, and keeps the rate-limit fields', () => {
		const error = withoutRequestData(
			apiError(
				{ message: 'bad' },
				{
					body: { description: 'agent node' },
					headers: { Authorization: 'Bearer tskey-api-secret' },
					query: { hostname: 'dave-laptop' },
				},
			),
		);
		expect(error.status).toBe(400);
		expect(error.retryAfter).toBe(5);
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		expect(error.request.query).toEqual({ hostname: '[REDACTED]' });
		expect(error.url).toBe(
			'https://api.tailscale.com/api/v2/tailnet/-/devices?[REDACTED]',
		);
		expect(JSON.stringify(error)).not.toContain('tskey-api-secret');
		expect(JSON.stringify(error)).not.toContain('dave-laptop');
	});

	it('removes anything it sent that Tailscale quotes back, short secrets as whole words', () => {
		const error = withoutRequestData(
			apiError(
				{
					message:
						'invalid token "hec-9f8e7d6c" for user splunk-svc; code 1234 bad, 12345 ok',
				},
				{
					body: {
						token: 'hec-9f8e7d6c',
						user: 'splunk-svc',
						s3SecretAccessKey: '1234',
					},
				},
			),
		);
		expect(error.message).toBe(
			'Tailscale 400: invalid token "[REDACTED]" for user [REDACTED]; code [REDACTED] bad, 12345 ok',
		);
	});

	it('drops fields a validation error uses to echo the value', () => {
		const error = withoutRequestData(
			apiError({ message: 'bad value', received: 'secret-thing', value: 'x' }),
		);
		expect(error.body).toEqual({ message: 'bad value' });
	});

	it('cuts the query off a URL', () => {
		expect(withoutQuery('https://x/devices?tags=a')).toBe(
			'https://x/devices?[REDACTED]',
		);
		expect(withoutQuery('https://x/devices')).toBe('https://x/devices');
	});
});
