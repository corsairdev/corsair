import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeSevdeskRequest, SEVDESK_API_BASE } from './client';

const token = '0123456789abcdef0123456789abcdef';
let fetchSpy: jest.SpyInstance;
beforeEach(() => {
	fetchSpy = jest.spyOn(globalThis, 'fetch');
});
afterEach(() => {
	fetchSpy.mockRestore();
});

describe('Sevdesk JSON client', () => {
	it('uses the documented host, raw token, and JSON headers', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(JSON.stringify({ objects: [] }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await makeSevdeskRequest('GET', '/Contact', token);
		expect(fetchSpy.mock.calls[0]?.[0]).toBe(`${SEVDESK_API_BASE}/Contact`);
		const headers = new Headers(fetchSpy.mock.calls[0]?.[1]?.headers);
		expect(headers.get('Authorization')).toBe(token);
		expect(headers.get('Accept')).toBe('application/json');
		expect(headers.get('User-Agent')).toBe('Corsair Sevdesk integration');
		expect(headers.get('X-Version')).toBeNull();
	});
	it('adds X-Version and encodes path parameters', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(JSON.stringify({ objects: {} }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await makeSevdeskRequest('GET', '/Contact/{contactId}', token, {
			path: { contactId: 'contact id' },
			resourceVersion: '1.0',
		});
		expect(fetchSpy.mock.calls[0]?.[0]).toBe(
			`${SEVDESK_API_BASE}/Contact/contact%20id`,
		);
		expect(
			new Headers(fetchSpy.mock.calls[0]?.[1]?.headers).get('X-Version'),
		).toBe('1.0');
	});
	it('serializes pagination, nested filters, and JSON request bodies', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response('{"objects":[]}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await makeSevdeskRequest('GET', '/Contact', token, {
			query: {
				limit: 25,
				offset: 50,
				countAll: true,
				contact: { id: 8, objectName: 'Contact' },
			},
		});
		const listUrl = new URL(String(fetchSpy.mock.calls[0]?.[0]));
		expect(listUrl.searchParams.get('limit')).toBe('25');
		expect(listUrl.searchParams.get('offset')).toBe('50');
		expect(listUrl.searchParams.get('countAll')).toBe('true');
		expect(listUrl.searchParams.get('contact[id]')).toBe('8');
		fetchSpy.mockResolvedValueOnce(
			new Response('{"objects":{}}', {
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await makeSevdeskRequest('POST', '/Contact', token, {
			body: { name: 'Corsair test contact' },
		});
		const writeRequest = fetchSpy.mock.calls[1]?.[1];
		expect(writeRequest?.body).toBe(
			JSON.stringify({ name: 'Corsair test contact' }),
		);
		expect(new Headers(writeRequest?.headers).get('Content-Type')).toContain(
			'application/json',
		);
	});
	it('rejects missing and malformed tokens before fetch', async () => {
		await expect(
			makeSevdeskRequest('GET', '/Contact', undefined),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makeSevdeskRequest('GET', '/Contact', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makeSevdeskRequest('GET', '/Contact', 'not-a-token'),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchSpy).not.toHaveBeenCalled();
	});
	it('rejects invalid resource version values', async () => {
		await expect(
			makeSevdeskRequest('GET', '/Contact', token, {
				resourceVersion: 'latest\r\nAuthorization: leak',
			}),
		).rejects.toThrow('Invalid Sevdesk X-Version value');
		expect(fetchSpy).not.toHaveBeenCalled();
	});
	it('preserves Retry-After but sanitizes and does not replay a failed write', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					code: 'RATE_LIMITED',
					message: 'Sensitive contact content',
					contact: { name: 'Private Customer' },
				}),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '4' },
				},
			),
		);
		// unknown because the shared HTTP client rejects with an external transport value.
		const caught = await makeSevdeskRequest('POST', '/Contact', token, {
			body: { name: 'Sensitive Customer' },
		}).catch((error: unknown) => error);
		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError))
			throw new Error('Expected sanitized Sevdesk ApiError');
		expect(caught.status).toBe(429);
		expect(caught.retryAfter).toBe(4000);
		expect(caught.message).toBe('Sevdesk API request failed');
		expect(caught.body).toEqual({
			code: 'RATE_LIMITED',
			message: '[REDACTED]',
			contact: { name: '[REDACTED]' },
		});
		expect(caught.url).toBe(SEVDESK_API_BASE);
		expect(caught.request.body).toBeUndefined();
		expect(caught.stack).toBeDefined();
		expect(caught.stack).not.toContain('Sensitive contact content');
		expect(caught.stack).not.toContain('Private Customer');
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
	it('retries transient server errors only for reads', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response('{}', {
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		fetchSpy.mockResolvedValueOnce(
			new Response('{}', {
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		fetchSpy.mockResolvedValueOnce(
			new Response('{"objects":[]}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await makeSevdeskRequest('GET', '/Contact', token, { replayable: true });
		expect(fetchSpy).toHaveBeenCalledTimes(3);
	});
	it('does not retry server errors for writes', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response('{}', {
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			makeSevdeskRequest('POST', '/Contact', token, {
				body: { name: 'Private' },
			}),
		).rejects.toThrow('Sevdesk API request failed');
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
	it('does not retry GET actions that can send, commit, or create exports', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response('{}', {
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			makeSevdeskRequest(
				'GET',
				'/CreditNote/{creditNoteId}/sendByWithRender',
				token,
				{ path: { creditNoteId: 1 }, replayable: false },
			),
		).rejects.toThrow('Sevdesk API request failed');
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
	it('uses the documented base URL', () => {
		expect(SEVDESK_API_BASE).toBe('https://my.sevdesk.de/api/v1');
	});
});
