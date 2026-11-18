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

	it('never forwards the provider validation text (Jane Doe is not a valid name)', async () => {
		fetchSpy.mockResolvedValue(
			new Response(
				JSON.stringify({
					success: false,
					data: null,
					errors: [
						{
							name: 'VALIDATION_ERROR',
							message: 'Jane Doe is not a valid name',
						},
						{
							name: 'VALIDATION_ERROR',
							message: 'Jane Doe is not a valid name',
							payload: { code: 'invalid_value', field: 'data.first_name' },
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
		expect(caught.message).toBe(
			'GetProspect request failed (HTTP 400): VALIDATION_ERROR: the request failed validation',
		);
		expect(caught.body).toEqual({
			success: false,
			data: null,
			errors: [
				{ name: 'VALIDATION_ERROR', message: 'the request failed validation' },
				{
					name: 'VALIDATION_ERROR',
					message: 'data.first_name has an invalid value',
					payload: { code: 'invalid_value' },
				},
			],
		});
		for (const leaked of ['Jane', 'Doe']) {
			expect(caught.message).not.toContain(leaked);
			expect(JSON.stringify(caught.body)).not.toContain(leaked);
		}
	});

	it('writes validation text from the error code and allowlisted field names only', async () => {
		const validationError = (payload: Record<string, unknown>) =>
			new Response(
				JSON.stringify({
					success: false,
					data: null,
					errors: [
						{
							name: 'VALIDATION_ERROR',
							message:
								'Got "Jane Doe" at jane@acme.test, +1 415 555 0123, from https://www.linkedin.com/in/jane-doe',
							payload,
						},
					],
				}),
				{ status: 400, headers: { 'content-type': 'application/json' } },
			);
		fetchSpy
			.mockResolvedValueOnce(
				validationError({
					code: 'unknown_field',
					field: 'enrich_mail',
					did_you_mean: 'enrich_email',
				}),
			)
			.mockResolvedValueOnce(
				validationError({
					code: 'wrong_type',
					field: 'data.email',
					received_type: 'number',
				}),
			)
			.mockResolvedValueOnce(
				validationError({
					code: 'missing_field',
					field: 'Jane Doe',
					received_type: 'Jane Doe',
				}),
			)
			.mockResolvedValueOnce(
				validationError({
					code: 'invalid_format',
					field: 'data.jane_doe_415',
					received_value: '+1 415 555 0123',
				}),
			)
			.mockResolvedValueOnce(
				validationError({ code: 'wrong_type', field: '14155550123' }),
			)
			.mockResolvedValueOnce(
				validationError({ code: 'missing_field', field: 'data.14155550123' }),
			)
			.mockResolvedValueOnce(
				validationError({ code: 'invalid_format', field: 'data[4155].email' }),
			);
		const messages: string[] = [];
		const bodies: string[] = [];
		for (let i = 0; i < 7; i += 1) {
			// unknown because the rejection may be any transport/provider value; the predicate narrows it.
			const caught = await makeGetProspectRequest(
				'/v2/people/enrich',
				'unit-key',
				{ method: 'POST', body: {} },
			).catch((error: unknown) => error);
			if (!(caught instanceof ApiError))
				throw new Error('Expected sanitized ApiError');
			messages.push(caught.message);
			bodies.push(JSON.stringify(caught.body));
		}
		const prefix = 'GetProspect request failed (HTTP 400): VALIDATION_ERROR';
		expect(messages).toEqual([
			`${prefix} (unknown_field): the request has a field the API does not accept (did you mean enrich_email?)`,
			`${prefix} (wrong_type): data.email has the wrong type (got number)`,
			`${prefix} (missing_field): a field is required`,
			`${prefix} (invalid_format): a field has an invalid format`,
			`${prefix} (wrong_type): a field has the wrong type`,
			`${prefix} (missing_field): data[n] is required`,
			`${prefix} (invalid_format): data[n].email has an invalid format`,
		]);
		for (const leaked of [
			'Jane',
			'jane',
			'415',
			'acme.test',
			'linkedin.com',
			'unit-key',
		]) {
			for (const text of [...messages, ...bodies]) {
				expect(text).not.toContain(leaked);
			}
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
