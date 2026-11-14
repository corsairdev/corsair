import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { EVENTEE_API_BASE, makeEventeeRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);
const actualHttp: typeof import('corsair/http') =
	jest.requireActual('corsair/http');
const actualRequest = actualHttp.request;

beforeEach(() => mockedRequest.mockReset());

describe('Eventee HTTP client', () => {
	it('uses Eventee base URL, v1, and the shared bearer-token configuration', async () => {
		mockedRequest.mockResolvedValue({ id: 1 });
		await makeEventeeRequest('/public/api/{api-version}/hall', 'event-token', {
			method: 'POST',
			body: { name: 'Main Stage' },
		});
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: EVENTEE_API_BASE,
			VERSION: 'v1',
			TOKEN: 'event-token',
			WITH_CREDENTIALS: false,
			HEADERS: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/public/api/{api-version}/hall',
			body: { name: 'Main Stage' },
		});
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('forwards path and query values for IDs and email removal filters', async () => {
		mockedRequest.mockResolvedValue(undefined);
		await makeEventeeRequest(
			'/public/api/{api-version}/attendee/{attendee_id}',
			'token',
			{
				method: 'DELETE',
				path: { attendee_id: 17 },
				query: { email: 'person@example.com' },
			},
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'DELETE',
			path: { attendee_id: 17 },
			query: { email: 'person@example.com' },
		});
	});

	it('fails without a stored per-event token before making a request', async () => {
		await expect(
			makeEventeeRequest('/public/api/v1/groups', undefined),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makeEventeeRequest('/public/api/v1/groups', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('does not expose malformed bearer tokens in transport errors', async () => {
		const token = 'private-event-token\r\nInjected: value';
		const fetchSpy = jest.spyOn(globalThis, 'fetch');
		mockedRequest.mockImplementation(actualRequest);

		const result = await makeEventeeRequest(
			'/public/api/v1/groups',
			token,
		).catch((caught: unknown) => caught); // Transport failures are untyped; assert only the sanitized error escapes.

		expect(result).toBeInstanceOf(Error);
		if (result instanceof Error) {
			expect(result.message).toBe('Eventee request failed');
			expect(result.message).not.toContain(token);
		}
		expect(fetchSpy).not.toHaveBeenCalled();
		fetchSpy.mockRestore();
	});

	it('redacts attendee input and provider details from propagated API errors', async () => {
		const providerError = new ApiError(
			{
				method: 'PUT',
				url: '/public/api/v1/attendee/invite',
				body: { email: 'private.person@example.com' },
			},
			{
				url: 'https://eventee.com/public/api/v1/attendee/invite',
				ok: false,
				status: 422,
				statusText: 'Validation failed',
				body: { message: 'Invalid email private.person@example.com' },
			},
			'Invalid email private.person@example.com',
			{ retryAfter: 1500 },
		);
		mockedRequest.mockRejectedValue(providerError);
		const result = await makeEventeeRequest(
			'/public/api/v1/attendee/invite',
			'token',
			{
				method: 'PUT',
				body: { email: 'private.person@example.com' },
			},
		).catch((caught: unknown) => caught); // Transport rejection values are untyped; check the sanitized ApiError below.
		expect(result).toBeInstanceOf(ApiError);
		if (result instanceof ApiError) {
			expect(result.request.body).toBeUndefined();
			expect(result.request.query).toBeUndefined();
			expect(result.body).toEqual({
				error: 'Eventee response details redacted',
			});
			expect(result.message).not.toContain('private.person@example.com');
			expect(result.retryAfter).toBe(1500);
		}
	});

	it.each([
		['attendee', '/public/api/v1/attendee'],
		['registration', '/public/api/v1/registration'],
	] as const)(
		'redacts email from failed %s removal URLs',
		async (_resource, path) => {
			const email = 'private.person@example.com';
			const responseUrl = `https://eventee.com${path}?email=${encodeURIComponent(email)}`;
			mockedRequest.mockRejectedValue(
				new ApiError(
					{ method: 'DELETE', url: path, query: { email } },
					{
						url: responseUrl,
						ok: false,
						status: 404,
						statusText: 'Not Found',
						body: { message: 'No matching record' },
					},
					'No matching record',
				),
			);
			const result = await makeEventeeRequest(path, 'token', {
				method: 'DELETE',
				query: { email },
			}).catch((caught: unknown) => caught); // Transport rejection values are untyped; narrow to ApiError below.
			expect(result).toBeInstanceOf(ApiError);
			if (result instanceof ApiError) {
				expect(result.url).toBe(`https://eventee.com${path}`);
				expect(result.url).not.toContain(email);
				expect(result.request.query).toBeUndefined();
				expect(result.body).toEqual({
					error: 'Eventee response details redacted',
				});
			}
		},
	);

	it('extracts Retry-After with the real shared transport without automatic retries', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ error: 'slow down' }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '4' },
			}),
		);
		const config: OpenAPIConfig = {
			BASE: EVENTEE_API_BASE,
			VERSION: 'v1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: 'private-event-token',
			HEADERS: { Accept: 'application/json' },
		};
		// The transport response is untrusted; this test only checks its error branch.
		const transportResult = await actualRequest<unknown>(
			config,
			{
				method: 'GET',
				url: '/public/api/{api-version}/groups',
			},
			{
				rateLimitConfig: {
					enabled: true,
					maxRetries: 0,
					initialRetryDelay: 0,
					backoffMultiplier: 1,
					headerNames: { retryAfter: 'retry-after' },
				},
			},
		).catch((caught: unknown) => caught); // Rejection values have no static type; narrow below.
		expect(transportResult).toBeInstanceOf(ApiError);
		if (transportResult instanceof ApiError) {
			expect(transportResult.retryAfter).toBe(4000);
		}
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const sentHeaders = fetchSpy.mock.calls[0]?.[1]?.headers;
		expect(sentHeaders).toBeInstanceOf(Headers);
		if (sentHeaders instanceof Headers) {
			expect(sentHeaders.get('authorization')).toBe(
				'Bearer private-event-token',
			);
		}
		fetchSpy.mockRestore();
	});
});
