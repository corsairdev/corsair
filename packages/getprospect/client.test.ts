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

	it('keeps the provider message with echoed input redacted', async () => {
		fetchSpy.mockResolvedValue(
			new Response(
				JSON.stringify({
					success: false,
					data: null,
					errors: [
						{
							name: 'VALIDATION_ERROR',
							message:
								'enrich_mail is not a field of this request - did you mean enrich_email? Got "Jane Doe" at jane@acme.test from https://www.linkedin.com/in/jane-doe',
							payload: { code: 'unknown_field' },
						},
					],
				}),
				{ status: 400, headers: { 'content-type': 'application/json' } },
			),
		);
		// unknown because the rejection may be any transport/provider value; the predicate narrows it.
		const caught = await makeGetProspectRequest(
			'/v2/people/enrich',
			'unit-key',
			{
				method: 'POST',
				body: { enrich_mail: true },
			},
		).catch((error: unknown) => error);
		if (!(caught instanceof ApiError))
			throw new Error('Expected sanitized ApiError');
		expect(caught.status).toBe(400);
		expect(caught.message).toContain('did you mean enrich_email?');
		for (const leaked of ['Jane Doe', 'jane@acme.test', 'linkedin.com']) {
			expect(caught.message).not.toContain(leaked);
			expect(JSON.stringify(caught.body)).not.toContain(leaked);
		}
	});

	it('keeps only field-level validation text and redacts phone numbers and coordinates', async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					success: false,
					data: null,
					errors: [
						{
							name: 'VALIDATION_ERROR',
							message:
								'phone must be E.164, got +1 415 555 0123 near 37.7749, -122.4194',
							payload: { code: 'invalid_format' },
						},
					],
				}),
				{ status: 400, headers: { 'content-type': 'application/json' } },
			),
		);
		fetchSpy.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					success: false,
					data: null,
					errors: [
						{
							name: 'NOT_FOUND',
							message: 'No person named Jane Doe at Acme',
						},
					],
				}),
				{ status: 404, headers: { 'content-type': 'application/json' } },
			),
		);
		// unknown because the rejection may be any transport/provider value; the predicate narrows it.
		const validation = await makeGetProspectRequest(
			'/v2/people/enrich',
			'unit-key',
			{ method: 'POST', body: {} },
		).catch((error: unknown) => error);
		// unknown because the rejection may be any transport/provider value; the predicate narrows it.
		const notFound = await makeGetProspectRequest(
			'/v2/people/p_1',
			'unit-key',
			{
				method: 'GET',
			},
		).catch((error: unknown) => error);
		if (!(validation instanceof ApiError) || !(notFound instanceof ApiError))
			throw new Error('Expected sanitized ApiError');
		expect(validation.message).toContain('phone must be E.164');
		for (const leaked of ['415', '555 0123', '37.7749', '122.4194']) {
			expect(validation.message).not.toContain(leaked);
			expect(JSON.stringify(validation.body)).not.toContain(leaked);
		}
		expect(notFound.status).toBe(404);
		expect(notFound.message).toBe(
			'GetProspect request failed (HTTP 404): NOT_FOUND',
		);
		expect(JSON.stringify(notFound.body)).not.toContain('Jane Doe');
	});

	it('drops unquoted values after a colon or "received" in validation text', async () => {
		fetchSpy.mockResolvedValue(
			new Response(
				JSON.stringify({
					success: false,
					data: null,
					errors: [
						{
							name: 'VALIDATION_ERROR',
							message: 'Invalid name: Jane Doe',
						},
						{
							name: 'VALIDATION_ERROR',
							message: 'company must be a domain, received Acme Robotics',
						},
					],
				}),
				{ status: 400, headers: { 'content-type': 'application/json' } },
			),
		);
		// unknown because the rejection may be any transport/provider value; the predicate narrows it.
		const caught = await makeGetProspectRequest(
			'/v2/people/enrich',
			'unit-key',
			{ method: 'POST', body: {} },
		).catch((error: unknown) => error);
		if (!(caught instanceof ApiError))
			throw new Error('Expected sanitized ApiError');
		expect(caught.message).toContain('Invalid name');
		expect(JSON.stringify(caught.body)).toContain('company must be a domain');
		for (const leaked of ['Jane Doe', 'Acme Robotics']) {
			expect(caught.message).not.toContain(leaked);
			expect(JSON.stringify(caught.body)).not.toContain(leaked);
		}
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
