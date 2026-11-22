import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	AMIKA_API_BASE,
	amikaErrorMessage,
	encodeAmikaPathValue,
	makeAmikaRequest,
	withoutQuery,
	withoutRequestData,
} from './client';

const KEY = 'sk_TestKeyValue1234567890abcdef';

const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

// `unknown` because a test answer is any JSON value.
function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'content-type': 'application/json' },
		...init,
	});
}

/** The URL, method, headers and body of the nth fetch call. */
function sentAt(index: number) {
	const [input, init] = fetchMock.mock.calls[index] ?? [];
	const url =
		typeof input === 'string'
			? input
			: input instanceof URL
				? input.href
				: (input?.url ?? '');
	return {
		url,
		method: init?.method,
		headers: new Headers(init?.headers),
		body: init?.body,
	};
}

beforeEach(() => {
	fetchMock.mockReset();
	global.fetch = fetchMock as unknown as typeof fetch;
});

describe('transport', () => {
	it('sends the key as a bearer token to the v0beta1 API', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse([]));
		await expect(
			makeAmikaRequest({ key: KEY, method: 'GET', path: '/rigs' }),
		).resolves.toEqual([]);
		const sent = sentAt(0);
		expect(sent.url).toBe(`${AMIKA_API_BASE}/rigs`);
		expect(sent.method).toBe('GET');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${KEY}`);
	});

	it('sends path values encoded, query values, headers and a JSON body', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ id: 'cr1' }, { status: 201 }),
		);
		await makeAmikaRequest({
			key: KEY,
			method: 'POST',
			path: '/rigs/{id}/services',
			pathParameters: { id: 'my rig' },
			query: { by: 'name' },
			headers: { 'Idempotency-Key': 'k-1' },
			body: { name: 'web', port: 3000, url_scheme: 'https' },
		});
		const sent = sentAt(0);
		expect(sent.url).toBe(`${AMIKA_API_BASE}/rigs/my%20rig/services?by=name`);
		expect(sent.headers.get('idempotency-key')).toBe('k-1');
		expect(sent.headers.get('content-type')).toMatch(/application\/json/);
		expect(JSON.parse(String(sent.body))).toEqual({
			name: 'web',
			port: 3000,
			url_scheme: 'https',
		});
	});

	it('reaches the custom-method route with its colon', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ metadata: {} }));
		await makeAmikaRequest({
			key: KEY,
			method: 'GET',
			path: '/rigs:slackMetadata',
		});
		expect(sentAt(0).url).toBe(`${AMIKA_API_BASE}/rigs:slackMetadata`);
	});

	it('refuses an empty key before any request', async () => {
		await expect(
			makeAmikaRequest({ key: '', method: 'GET', path: '/rigs' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('encodes path values and refuses ones that would change the route', () => {
		expect(encodeAmikaPathValue('dev-rig')).toBe('dev-rig');
		expect(encodeAmikaPathValue('a/b')).toBe('a%2Fb');
		for (const value of ['', '.', '..']) {
			expect(() => encodeAmikaPathValue(value)).toThrow(
				'Invalid Amika path value',
			);
		}
	});

	it("raises an ApiError with the status and Amika's reason, without the key or body", async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					type: 'error',
					error_code: 'sandbox_name_conflict',
					message: 'a rig named dev-rig already exists',
					trace_id: 't-123',
				},
				{ status: 409 },
			),
		);
		const error = (await makeAmikaRequest({
			key: KEY,
			method: 'POST',
			path: '/rigs',
			body: { name: 'dev-rig', secret_env_vars: { TOKEN: 'shh-secret' } },
		}).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(409);
		expect(error.message).toBe(
			'Amika 409 sandbox_name_conflict: a rig named [REDACTED] already exists (trace t-123)',
		);
		expect(error.request.body).toBe('[REDACTED]');
		expect(JSON.stringify(error)).not.toContain(KEY);
		expect(JSON.stringify(error)).not.toContain('shh-secret');
	});

	it('reports a bad key as a 401 with its reason', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ error: 'Invalid API key' }, { status: 401 }),
		);
		const error = (await makeAmikaRequest({
			key: KEY,
			method: 'GET',
			path: '/rigs',
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(401);
		expect(error.message).toBe('Amika 401: Invalid API key');
	});
});

describe('errors', () => {
	function apiError(
		// `unknown` because an error body is whatever Amika sent.
		body: unknown,
		// `unknown` because each case sets only the request fields it checks.
		request: Record<string, unknown> = {},
	): ApiError {
		return new ApiError(
			{ method: 'POST', url: '/secrets', ...request },
			{
				url: 'https://app.amika.dev/api/v0beta1/command-runs?rig=customer-acme',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body,
			},
			'Bad Request',
			{ retryAfter: 5 },
		);
	}

	it("puts Amika's code and reason in the message", () => {
		expect(
			amikaErrorMessage(404, 'Not Found', {
				type: 'error',
				error_code: 'validation_failed',
				message: 'Slack settings not configured',
				trace_id: 'abc',
			}),
		).toBe(
			'Amika 404 validation_failed: Slack settings not configured (trace abc)',
		);
		expect(amikaErrorMessage(502, 'Bad Gateway', 'upstream down')).toBe(
			'Amika 502: upstream down',
		);
		expect(amikaErrorMessage(500, '', {})).toBe('Amika 500: request failed');
		expect(
			amikaErrorMessage(400, '', { message: 'x'.repeat(600) }),
		).toHaveLength(500);
	});

	it('drops the sent body, headers and query values, and keeps the rate-limit fields', () => {
		const error = withoutRequestData(
			apiError(
				{ message: 'bad' },
				{
					body: { name: 'stripe', value: 'sk_live_abc' },
					headers: { Authorization: `Bearer ${KEY}` },
					query: { rig: 'customer-acme' },
				},
			),
		);
		expect(error.status).toBe(400);
		expect(error.retryAfter).toBe(5);
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		expect(error.request.query).toEqual({ rig: '[REDACTED]' });
		expect(error.url).toBe(
			'https://app.amika.dev/api/v0beta1/command-runs?[REDACTED]',
		);
		expect(JSON.stringify(error)).not.toContain(KEY);
		expect(JSON.stringify(error)).not.toContain('customer-acme');
	});

	it('removes anything it sent that Amika quotes back, short secrets as whole words', () => {
		const error = withoutRequestData(
			apiError(
				{
					message:
						'secret value "hunter2-xyz" for name deploy-key is invalid; pin 4321 bad, 43210 ok',
				},
				{
					body: { value: 'hunter2-xyz', name: 'deploy-key', api_key: '4321' },
				},
			),
		);
		expect(error.message).toBe(
			'Amika 400: secret value "[REDACTED]" for name [REDACTED] is invalid; pin [REDACTED] bad, 43210 ok',
		);
	});

	it('drops fields a validation error uses to echo the value', () => {
		const error = withoutRequestData(
			apiError({ message: 'bad value', received: 'secret-thing', value: 'x' }),
		);
		expect(error.body).toEqual({ message: 'bad value' });
	});

	it('cuts the query off a URL', () => {
		expect(withoutQuery('https://x/rigs?by=name')).toBe(
			'https://x/rigs?[REDACTED]',
		);
		expect(withoutQuery('https://x/rigs')).toBe('https://x/rigs');
	});
});
