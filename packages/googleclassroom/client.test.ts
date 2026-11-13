import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import {
	GOOGLE_CLASSROOM_API_BASE,
	makeGoogleClassroomRequest,
} from './client';

jest.mock('corsair/http', () => ({ request: jest.fn() }));

const mockedRequest = jest.mocked(request);

describe('Google Classroom HTTP client', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
	});

	it('uses OAuth bearer auth, the stable v1 host, JSON, and query parameters', async () => {
		mockedRequest.mockResolvedValue({ ok: true });

		await makeGoogleClassroomRequest('/v1/courses', 'access-token', {
			method: 'GET',
			query: { pageSize: 10, pageToken: 'next-page' },
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: GOOGLE_CLASSROOM_API_BASE,
				VERSION: 'v1',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				HEADERS: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer access-token',
				},
			}),
			{
				method: 'GET',
				url: '/v1/courses',
				body: undefined,
				mediaType: 'application/json; charset=utf-8',
				query: { pageSize: 10, pageToken: 'next-page' },
			},
		);
	});

	it('sends JSON bodies and update-mask queries on writes', async () => {
		mockedRequest.mockResolvedValue({ id: 'course-123' });
		const body = { name: 'Biology', ownerId: 'me' };

		await makeGoogleClassroomRequest('/v1/courses', 'access-token', {
			method: 'POST',
			body,
			query: { fields: 'id' },
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v1/courses',
				body,
				query: { fields: 'id' },
			}),
		);
	});

	it('fails before transport when the resolved OAuth token is empty', async () => {
		await expect(
			makeGoogleClassroomRequest('/v1/courses', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('preserves transport errors unchanged', async () => {
		const error = new Error('Unauthorized');
		mockedRequest.mockRejectedValue(error);

		await expect(
			makeGoogleClassroomRequest('/v1/courses', 'access-token'),
		).rejects.toBe(error);
	});

	it('extracts Retry-After with the real shared transport without retry multiplication', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({ error: { message: 'Too many requests' } }),
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				},
			),
		);
		const config: OpenAPIConfig = {
			BASE: GOOGLE_CLASSROOM_API_BASE,
			VERSION: 'v1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		};
		// `unknown` because the shared transport response is untrusted until validated by an operation schema.
		const result = await actualHttp
			.request<unknown>(
				config,
				{ method: 'GET', url: '/v1/courses' },
				{
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 0,
						backoffMultiplier: 1,
						headerNames: { retryAfter: 'retry-after' },
					},
				},
			)
			// `unknown` because promise rejection values do not have a static type.
			.catch((caught: unknown) => caught);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(result).toBeInstanceOf(actualHttp.ApiError);
		if (result instanceof actualHttp.ApiError) {
			expect(result.status).toBe(429);
			expect(result.retryAfter).toBe(4000);
		} else {
			throw new Error(
				'Expected the shared transport to return a rate-limit error',
			);
		}
		fetchMock.mockRestore();
	});
});
