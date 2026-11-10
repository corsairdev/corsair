import { MixmaxAPIError, makeMixmaxRequest } from './client';

const fetchMock = jest.spyOn(global, 'fetch');

const jsonResponse = (
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});

describe('Mixmax transport client', () => {
	beforeEach(() => {
		fetchMock.mockClear();
		fetchMock.mockImplementation(async () => jsonResponse({ ok: true }));
	});

	it('sends the personal token as the X-API-Token header', async () => {
		await makeMixmaxRequest({ key: 'mx-token-1' }, '/v1/users/me');

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [, init] = fetchMock.mock.calls[0] ?? [];
		const headers = new Headers(init?.headers);
		expect(headers.get('X-API-Token')).toBe('mx-token-1');
		expect(headers.get('content-type')).toBe('application/json');
	});

	it('builds the URL against the Mixmax API base and serializes query values', async () => {
		await makeMixmaxRequest({ key: 'k' }, '/v1/messages', {
			method: 'GET',
			query: { limit: 20, fields: 'subject,created', next: undefined },
		});

		const [url] = fetchMock.mock.calls[0] ?? [];
		const parsed = new URL(String(url));
		expect(parsed.origin + parsed.pathname).toBe(
			'https://api.mixmax.com/v1/messages',
		);
		expect(parsed.searchParams.get('limit')).toBe('20');
		expect(parsed.searchParams.get('fields')).toBe('subject,created');
		// undefined query values must not be serialized at all
		expect(parsed.searchParams.has('next')).toBe(false);
	});

	it('forwards a JSON body for POST', async () => {
		await makeMixmaxRequest({ key: 'k' }, '/v1/messages', {
			method: 'POST',
			body: { subject: 'Hello' },
		});

		const [, init] = fetchMock.mock.calls[0] ?? [];
		expect(init?.method).toBe('POST');
		expect(String(init?.body)).toBe(JSON.stringify({ subject: 'Hello' }));
	});

	it('forwards a JSON body for DELETE, as the unsubscribes contract requires', async () => {
		await makeMixmaxRequest({ key: 'k' }, '/v1/unsubscribes', {
			method: 'DELETE',
			body: { email: 'user@example.com' },
		});

		const [, init] = fetchMock.mock.calls[0] ?? [];
		expect(init?.method).toBe('DELETE');
		expect(String(init?.body)).toBe(
			JSON.stringify({ email: 'user@example.com' }),
		);
	});

	it('serializes query values for write methods too', async () => {
		await makeMixmaxRequest({ key: 'k' }, '/v1/snippettags', {
			method: 'POST',
			body: { name: 'Templates' },
			query: { isInline: true },
		});

		const [url] = fetchMock.mock.calls[0] ?? [];
		expect(new URL(String(url)).searchParams.get('isInline')).toBe('true');
	});

	it('resolves undefined for a 204 response', async () => {
		fetchMock.mockImplementation(
			async () => new Response(null, { status: 204 }),
		);
		const result = await makeMixmaxRequest({ key: 'k' }, '/v1/snippets/abc', {
			method: 'DELETE',
		});
		expect(result).toBeUndefined();
	});

	it('returns the raw text for non-JSON responses, as the plain-text endpoints send', async () => {
		fetchMock.mockImplementation(
			async () =>
				new Response('OK', {
					status: 200,
					headers: { 'content-type': 'text/html' },
				}),
		);
		const result = await makeMixmaxRequest({ key: 'k' }, '/v1/send', {
			method: 'POST',
		});
		expect(result).toBe('OK');
	});

	it('wraps ApiError failures and preserves status and Retry-After', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse({ message: 'Too Many Requests' }, 429, {
				'retry-after': '7',
			}),
		);

		const errorPromise = makeMixmaxRequest({ key: 'k' }, '/v1/messages');
		await expect(errorPromise).rejects.toBeInstanceOf(MixmaxAPIError);
		// unknown: the rejection value is inspected through the caught error so
		// the assertion covers the exact class instance the handler throws.
		await errorPromise.catch((error: MixmaxAPIError) => {
			expect(error.status).toBe(429);
			// The shared transport normalizes the seconds-based Retry-After
			// header into milliseconds for the retry policy.
			expect(error.retryAfter).toBe(7000);
			expect(error.message).toContain('Too Many Requests');
		});
	});

	it('keeps the transport single-attempt even on retryable statuses', async () => {
		fetchMock.mockImplementation(async () => jsonResponse({}, 429));
		await makeMixmaxRequest({ key: 'k' }, '/v1/messages').catch(
			() => undefined,
		);
		// The 429 retry policy belongs to the plugin error handler; the
		// transport itself must make exactly one attempt.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
