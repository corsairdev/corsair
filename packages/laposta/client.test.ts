import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { LAPOSTA_API_BASE, makeLapostaRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const actualHttp =
	jest.requireActual<typeof import('corsair/http')>('corsair/http');
const originalFetch = globalThis.fetch;

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/list' },
		{
			url: 'https://api.laposta.nl/v2/list',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

afterEach(() => {
	globalThis.fetch = originalFetch;
});

describe('makeLapostaRequest', () => {
	it('keeps member emails from the request out of a rejected ApiError', async () => {
		// The mock rejects like core's request(); cast because CancelablePromise has private fields.
		mockRequest.mockImplementation((async (
			_config: unknown,
			options: Parameters<typeof request>[1],
		) => {
			throw new actualHttp.ApiError(
				options,
				{
					url: `${LAPOSTA_API_BASE}/member/person%40example.net?list_id=list-1`,
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					body: {
						error: {
							type: 'invalid_input',
							message: 'Email address exists',
							code: 204,
							parameter: 'email',
						},
					},
				},
				'Bad Request',
			);
		}) as never);

		const rejection = await makeLapostaRequest(
			'/member/person%40example.net',
			'test-key',
			{
				method: 'POST',
				query: { list_id: 'list-1' },
				body: { list_id: 'list-1', email: 'person@example.net' },
			},
		).catch((error: unknown) => error);

		expect(rejection).toBeInstanceOf(ApiError);
		const error = rejection as ApiError;
		expect(error.status).toBe(400);
		expect(error.body).toEqual({
			error: {
				type: 'invalid_input',
				message: 'Email address exists',
				code: 204,
				parameter: 'email',
			},
		});
		expect(JSON.stringify({ ...error, message: error.message })).not.toMatch(
			/person|example\.net/,
		);
		expect(error.request.body).toBeUndefined();
	});

	it('sends HTTP Basic Auth with API key as username and empty password', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeLapostaRequest('/list', 'test-api-key', { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const expectedBasic = Buffer.from('test-api-key:').toString('base64');
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LAPOSTA_API_BASE,
			HEADERS: {
				Authorization: `Basic ${expectedBasic}`,
			},
		});
	});

	it('uses form encoding by default for single-resource writes', async () => {
		mockRequest.mockResolvedValue({ member: { member_id: 'm1' } });

		await makeLapostaRequest('/member', 'test-key', {
			method: 'POST',
			body: {
				list_id: 'l1',
				email: 'user@example.com',
				custom_fields: { interests: ['news', 'events'] },
			},
			query: { include: true },
		});

		const requestOptions = mockRequest.mock.calls[0]?.[1];
		expect(requestOptions).toMatchObject({
			method: 'POST',
			url: '/member',
			body: 'list_id=l1&email=user%40example.com&custom_fields%5Binterests%5D%5B%5D=news&custom_fields%5Binterests%5D%5B%5D=events',
			mediaType: 'application/x-www-form-urlencoded; charset=utf-8',
			query: { include: true },
		});
	});

	it('keeps documented JSON encoding available for bulk writes', async () => {
		mockRequest.mockResolvedValue({ report: { provided_count: 1 } });
		const body = { actions: ['add'], members: [{ email: 'user@example.com' }] };

		await makeLapostaRequest('/list/l1/members', 'test-key', {
			method: 'POST',
			body,
			bodyEncoding: 'json',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			body,
			mediaType: 'application/json; charset=utf-8',
		});
	});

	it('throws AuthMissingError when key is explicitly empty without sending network request', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		// unknown because the rejection from missing auth is a runtime error value.
		await expect(
			makeLapostaRequest('/list', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with its retry metadata intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 4000);
		mockRequest.mockRejectedValue(rateLimited);

		// unknown because the caught rejection value has no static type.
		const rejection = await makeLapostaRequest('/list', 'test-key', {
			method: 'GET',
		}).catch((error: unknown) => error);
		expect(rejection).toBeInstanceOf(ApiError);
		expect((rejection as ApiError).status).toBe(429);
		expect((rejection as ApiError).retryAfter).toBe(4000);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('extracts Retry-After with the real Corsair transport and leaves handler retries at zero', async () => {
		let attempts = 0;
		globalThis.fetch = async () => {
			attempts += 1;
			return new Response(
				JSON.stringify({ error: { message: 'Too many requests' } }),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '0' },
				},
			);
		};
		mockRequest.mockImplementationOnce(actualHttp.request);

		// unknown because a transport rejection is not statically tied to a provider response.
		const failure = await makeLapostaRequest('/list', 'test-key', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(failure).toBeInstanceOf(ApiError);
		if (!(failure instanceof ApiError)) {
			throw new Error('Expected the real transport to throw ApiError');
		}
		expect(attempts).toBe(4);
		expect(failure.retryAfter).toBe(0);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(failure)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
