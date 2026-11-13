import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GETPROSPECT_API_BASE, makeGetProspectRequest } from './client';

const fetchSpy = jest.spyOn(globalThis, 'fetch');

describe('GetProspect HTTP client', () => {
	afterEach(() => {
		fetchSpy.mockReset();
	});

	it('uses the v2 host, x-api-key auth, JSON content type, and supplied timeout', async () => {
		fetchSpy.mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);

		await makeGetProspectRequest('/v2/me', 'unit-key', {
			method: 'GET',
			timeout: 95_000,
		});

		expect(GETPROSPECT_API_BASE).toBe('https://api.getprospect.com');
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const [url, init] = fetchSpy.mock.calls[0] ?? [];
		expect(url).toBe(`${GETPROSPECT_API_BASE}/v2/me`);
		expect(init?.method).toBe('GET');
		const headers = new Headers(init?.headers);
		expect(headers.get('x-api-key')).toBe('unit-key');
		expect(headers.get('content-type')).toBe('application/json');
		expect(init?.signal).toBeDefined();
	});

	it('fails before network access when the key is missing or empty', async () => {
		await expect(
			makeGetProspectRequest('/v2/me', undefined),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(makeGetProspectRequest('/v2/me', '')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('sanitizes provider errors without losing status or Retry-After', async () => {
		fetchSpy.mockResolvedValue(
			new Response(
				JSON.stringify({
					success: false,
					errors: [
						{
							name: 'RATE_LIMIT',
							message: 'person@samplemail.test and unit-key',
							payload: {
								code: 'rate_limit_exceeded',
								bucket: 'search',
								window: 'day',
								reset_seconds: 45,
								received_value: 'person@samplemail.test',
							},
						},
					],
				}),
				{
					status: 429,
					headers: {
						'content-type': 'application/json',
						'retry-after': '4',
					},
				},
			),
		);

		// unknown because the rejection may be any transport/provider value; the predicate narrows it.
		const caught = await makeGetProspectRequest('/v2/email/find', 'unit-key', {
			method: 'POST',
			body: { email: 'person@samplemail.test' },
		}).catch((error: unknown) => error);
		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError))
			throw new Error('Expected sanitized ApiError');
		expect(caught.status).toBe(429);
		expect(caught.retryAfter).toBe(4000);
		expect(caught.body).toEqual({
			success: false,
			data: null,
			errors: [
				{
					name: 'RATE_LIMIT',
					payload: {
						code: 'rate_limit_exceeded',
						bucket: 'search',
						window: 'day',
						reset_seconds: 45,
					},
				},
			],
		});
		expect(JSON.stringify(caught.body)).not.toContain('person@samplemail.test');
		expect(caught.request.body).toBeUndefined();
		expect(caught.message).not.toContain('person@samplemail.test');
		expect(caught.message).not.toContain('unit-key');
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('does not expose transport URLs or error details for non-API failures', async () => {
		fetchSpy.mockRejectedValue(
			new Error('https://api.getprospect.com/?email=person@samplemail.test'),
		);
		await expect(
			makeGetProspectRequest('/v2/email/find', 'unit-key'),
		).rejects.toThrow('GetProspect request failed');
	});
});
