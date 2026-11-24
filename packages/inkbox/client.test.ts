import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	encodeInkboxPathValue,
	INKBOX_API_BASE,
	inkboxErrorMessage,
	makeInkboxRequest,
	routeUrl,
	tryGetStoredKey,
	withoutQuery,
	withoutRequestData,
} from './client';

const KEY = 'ApiKey_TestKeyValue1234567890abcdef';

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
	// `unknown` because jest's mock has no fetch overloads, so it is cast through unknown.
	global.fetch = fetchMock as unknown as typeof fetch;
});

describe('transport', () => {
	it('sends the key as X-API-Key to inkbox.ai', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse([]));
		await expect(
			makeInkboxRequest({
				key: KEY,
				method: 'GET',
				path: '/api/v1/identities/',
			}),
		).resolves.toEqual([]);
		const sent = sentAt(0);
		expect(sent.url).toBe(`${INKBOX_API_BASE}/api/v1/identities/`);
		expect(sent.method).toBe('GET');
		expect(sent.headers.get('x-api-key')).toBe(KEY);
		expect(sent.headers.get('authorization')).toBeNull();
	});

	it('sends path values encoded, query values, headers and a JSON body', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'm1' }));
		await makeInkboxRequest({
			key: KEY,
			method: 'POST',
			path: '/api/v1/mail/mailboxes/{email_address}/messages',
			pathParameters: { email_address: 'agent@inkboxmail.com' },
			query: { track: true },
			headers: { 'Idempotency-Key': 'k-1' },
			body: { subject: 'Hello', recipients: { to: ['ada@example.com'] } },
		});
		const sent = sentAt(0);
		expect(sent.url).toBe(
			`${INKBOX_API_BASE}/api/v1/mail/mailboxes/agent%40inkboxmail.com/messages?track=true`,
		);
		expect(sent.headers.get('idempotency-key')).toBe('k-1');
		expect(sent.headers.get('content-type')).toMatch(/application\/json/);
		expect(JSON.parse(String(sent.body))).toEqual({
			subject: 'Hello',
			recipients: { to: ['ada@example.com'] },
		});
	});

	it('sends a raw text body with its own content type', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ created_count: 1 }));
		const vcard = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Ada\r\nEND:VCARD\r\n';
		await makeInkboxRequest({
			key: KEY,
			method: 'POST',
			path: '/api/v1/contacts/import',
			body: vcard,
			mediaType: 'text/vcard; charset=utf-8',
		});
		const sent = sentAt(0);
		expect(sent.body).toBe(vcard);
		expect(sent.headers.get('content-type')).toBe('text/vcard; charset=utf-8');
	});

	it('sends a multipart form without setting its boundary itself', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ agent_handle: 'support' }));
		const form = new FormData();
		form.append('file', new Blob(['png']), 'a.png');
		await makeInkboxRequest({
			key: KEY,
			method: 'PUT',
			path: '/api/v1/identities/{agent_handle}/avatar',
			pathParameters: { agent_handle: 'support' },
			body: form,
		});
		const sent = sentAt(0);
		expect(sent.body).toBeInstanceOf(FormData);
		expect(sent.headers.get('content-type') ?? '').not.toMatch(/json/);
	});

	it('returns bytes and their content type for a binary response', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1, 2, 3]), {
				status: 200,
				headers: { 'content-type': 'image/jpeg' },
			}),
		);
		const binary = (await makeInkboxRequest({
			key: KEY,
			method: 'GET',
			path: '/api/v1/identities/{agent_handle}/avatar',
			pathParameters: { agent_handle: 'support' },
			responseType: 'binary',
		})) as { bytes: Uint8Array; contentType: string };
		expect([...binary.bytes]).toEqual([1, 2, 3]);
		expect(binary.contentType).toBe('image/jpeg');
	});

	it('refuses an empty key before any request', async () => {
		await expect(
			makeInkboxRequest({
				key: '',
				method: 'GET',
				path: '/api/v1/identities/',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('encodes path values and refuses ones that would change the route', () => {
		expect(encodeInkboxPathValue('agent@inkboxmail.com')).toBe(
			'agent%40inkboxmail.com',
		);
		expect(encodeInkboxPathValue('../api-keys/self')).toBe(
			'..%2Fapi-keys%2Fself',
		);
		expect(() => encodeInkboxPathValue('..')).toThrow(
			'Invalid Inkbox path value',
		);
		expect(() => encodeInkboxPathValue('')).toThrow(
			'Invalid Inkbox path value',
		);
	});

	it("raises an ApiError with the status and Inkbox's reason, without the key, body or address", async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					detail: 'Mailbox agent@inkboxmail.com not found',
					agent_support:
						'If you cannot resolve this issue, contact the Inkbox Support Agent.',
				},
				{ status: 404 },
			),
		);
		const error = (await makeInkboxRequest({
			key: KEY,
			method: 'POST',
			path: '/api/v1/mail/mailboxes/{email_address}/messages',
			pathParameters: { email_address: 'agent@inkboxmail.com' },
			body: { subject: 'Quarterly numbers', body_text: 'Revenue was 1.2M' },
			// `unknown` because a rejected promise can carry anything until cast to ApiError.
		}).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Inkbox 404: Mailbox [REDACTED] not found');
		const serialized = JSON.stringify({
			message: error.message,
			body: error.body,
			request: error.request,
			url: error.url,
		});
		expect(serialized).not.toContain(KEY);
		expect(serialized).not.toContain('agent@inkboxmail.com');
		expect(serialized).not.toContain('Revenue');
		expect(serialized).not.toContain('agent_support');
	});

	it('reports a bad key as a 401 with its reason', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'Unauthorized' }, { status: 401 }),
		);
		const error = (await makeInkboxRequest({
			key: KEY,
			method: 'GET',
			path: '/api/v1/identities/',
			// `unknown` because a rejected promise can carry anything until cast to ApiError.
		}).catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(401);
		expect(error.message).toBe('Inkbox 401: Unauthorized');
	});
});

describe('errors', () => {
	function apiError(
		// `unknown` because an error body is whatever Inkbox sent.
		body: unknown,
		// `unknown` because each case sets only the request fields it checks.
		request: Record<string, unknown> = {},
		status = 422,
	): ApiError {
		return new ApiError(
			{ method: 'POST', url: '/api/v1/contacts/', ...request },
			{
				url: 'https://inkbox.ai/api/v1/contacts/lookup?email=ada%40example.com',
				ok: false,
				status,
				statusText: 'Unprocessable Entity',
				body,
			},
			'Unprocessable Entity',
			{ retryAfter: 5 },
		);
	}

	it("puts FastAPI's detail in the message: a string or a list of field issues", () => {
		expect(
			inkboxErrorMessage(404, 'Not Found', { detail: 'Vault not initialized' }),
		).toBe('Inkbox 404: Vault not initialized');
		expect(
			inkboxErrorMessage(422, 'Unprocessable Entity', {
				detail: [
					{
						type: 'int_parsing',
						loc: ['query', 'limit'],
						msg: 'Input should be a valid integer',
					},
					{
						type: 'missing',
						loc: ['body', 'recipients', 'to'],
						msg: 'Field required',
					},
				],
			}),
		).toBe(
			'Inkbox 422: limit: Input should be a valid integer; recipients.to: Field required',
		);
		expect(inkboxErrorMessage(502, 'Bad Gateway', 'upstream down')).toBe(
			'Inkbox 502: upstream down',
		);
		expect(inkboxErrorMessage(500, '', {})).toBe('Inkbox 500: request failed');
	});

	it('drops the sent body, headers and query and path values, and keeps the rate-limit fields', () => {
		const error = withoutRequestData(
			apiError(
				{ detail: 'Invalid contact' },
				{
					body: { emails: [{ value: 'ada@example.com' }] },
					headers: { 'X-API-Key': KEY },
					query: { identity_id: 'abc' },
					path: { contact_id: 'c-1' },
				},
			),
		);
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		expect(error.request.query).toEqual({ identity_id: '[REDACTED]' });
		expect(error.request.path).toEqual({ contact_id: '[REDACTED]' });
		expect(error.url).toBe('https://inkbox.ai/api/v1/contacts/?[REDACTED]');
		expect(error.retryAfter).toBe(5);
		expect(error.status).toBe(422);
	});

	it('removes anything it sent that Inkbox quotes back, phone numbers and short codes as whole words', () => {
		const error = withoutRequestData(
			apiError(
				{
					detail:
						'Recipient +14155550123 has not opted in; code 4821 invalid, 48210 ok',
				},
				{ body: { to: ['+14155550123'], verification_code: '4821' } },
				403,
			),
		);
		expect(error.message).toBe(
			'Inkbox 403: Recipient [REDACTED] has not opted in; code [REDACTED] invalid, 48210 ok',
		);
	});

	it('removes a short customer value too, a name like Ada, as a whole word', () => {
		const error = withoutRequestData(
			apiError(
				{ detail: 'Contact Ada already exists; Adam is fine' },
				{ body: { given_name: 'Ada', family_name: 'Lovelace' } },
				409,
			),
		);
		expect(error.message).toBe(
			'Inkbox 409: Contact [REDACTED] already exists; Adam is fine',
		);
		expect(JSON.stringify(error.body)).not.toMatch(/\bAda\b/);
	});

	it('drops fields a validation error uses to echo the value', () => {
		const error = withoutRequestData(
			apiError({
				detail: [
					{
						type: 'string_type',
						loc: ['body', 'subject'],
						msg: 'Input should be a valid string',
						input: 'secret-thing',
						ctx: { error: 'secret-thing' },
					},
				],
				agent_support: 'contact support',
			}),
		);
		expect(JSON.stringify(error.body)).not.toContain('secret-thing');
		expect(JSON.stringify(error.body)).not.toContain('agent_support');
		expect(error.message).toBe(
			'Inkbox 422: subject: Input should be a valid string',
		);
	});

	it('keeps the route but not the values a call put in it', () => {
		expect(
			routeUrl(
				'https://inkbox.ai/api/v1/mail/mailboxes/agent%40inkboxmail.com/messages?limit=5',
				'/api/v1/mail/mailboxes/{email_address}/messages',
			),
		).toBe(
			'https://inkbox.ai/api/v1/mail/mailboxes/{email_address}/messages?[REDACTED]',
		);
		expect(withoutQuery('https://x/contacts/lookup?email=a')).toBe(
			'https://x/contacts/lookup?[REDACTED]',
		);
		expect(withoutQuery('https://x/contacts')).toBe('https://x/contacts');
	});
});

describe('stored keys', () => {
	it('treats a missing DEK as no stored key and passes other failures on', async () => {
		await expect(
			tryGetStoredKey(() =>
				Promise.reject(new Error('No DEK found for account')),
			),
		).resolves.toBeUndefined();
		await expect(
			tryGetStoredKey(() => Promise.resolve(null)),
		).resolves.toBeUndefined();
		await expect(tryGetStoredKey(() => Promise.resolve('k'))).resolves.toBe(
			'k',
		);
		await expect(
			tryGetStoredKey(() => Promise.reject(new Error('database down'))),
		).rejects.toThrow('database down');
	});
});
