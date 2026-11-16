import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import {
	FREEAGENT_API_BASE,
	FREEAGENT_SANDBOX_API_BASE,
	makeFreeAgentPaginatedRequest,
	makeFreeAgentRequest,
} from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);

beforeEach(() => mockedRequest.mockReset());

describe('FreeAgent client', () => {
	it('uses OAuth bearer auth, JSON headers, v2 and required User-Agent', async () => {
		mockedRequest.mockResolvedValue({ company: {} });
		await makeFreeAgentRequest('/v2/company', 'access-token');
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: FREEAGENT_API_BASE,
				VERSION: '2',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer access-token',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'User-Agent': expect.any(String),
				}),
			}),
			expect.objectContaining({ method: 'GET', url: '/v2/company' }),
		);
	});

	it('supports documented sandbox host and preserves query/body placement', async () => {
		mockedRequest.mockResolvedValue({ contacts: [] });
		await makeFreeAgentRequest('/v2/contacts', 'access-token', {
			method: 'POST',
			body: { contact: { organisation_name: 'Example Ltd' } },
			query: { page: 2 },
			sandbox: true,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: FREEAGENT_SANDBOX_API_BASE }),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/contacts',
				body: { contact: { organisation_name: 'Example Ltd' } },
				query: { page: 2 },
			}),
		);
	});

	it('fails before transport when the OAuth access token is empty', async () => {
		await expect(
			makeFreeAgentRequest('/v2/company', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('preserves the transport ApiError object and its retry metadata', async () => {
		const rateLimit = new ApiError(
			{ method: 'GET', url: '/v2/contacts' },
			{
				url: `${FREEAGENT_API_BASE}/v2/contacts`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 5000 },
		);
		mockedRequest.mockRejectedValue(rateLimit);
		await expect(
			makeFreeAgentRequest('/v2/contacts', 'access-token'),
		).rejects.toBe(rateLimit);
	});

	it('returns the documented Link and X-Total-Count pagination headers', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ contacts: [] }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					Link: '<https://api.freeagent.com/v2/contacts?page=3>; rel="next"',
					'X-Total-Count': '26',
				},
			}),
		);
		try {
			const result = await makeFreeAgentPaginatedRequest(
				'/v2/contacts',
				'access-token',
				{ page: 2, per_page: 50 },
				z
					.object({ contacts: z.array(z.object({}).passthrough()) })
					.passthrough(),
			);
			expect(result.data).toEqual({ contacts: [] });
			expect(result.pagination).toEqual({
				link: '<https://api.freeagent.com/v2/contacts?page=3>; rel="next"',
				total_count: '26',
			});
			const [url, init] = fetchMock.mock.calls[0] ?? [];
			expect(String(url)).toBe(
				'https://api.freeagent.com/v2/contacts?page=2&per_page=50',
			);
			expect(init?.method).toBe('GET');
			expect(new Headers(init?.headers).get('Authorization')).toBe(
				'Bearer access-token',
			);
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('retries a paginated GET after 429 using Retry-After', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response(null, {
					status: 429,
					headers: { 'Retry-After': '0' },
				}),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ contacts: [] }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
		try {
			await makeFreeAgentPaginatedRequest(
				'/v2/contacts',
				'access-token',
				{},
				z
					.object({ contacts: z.array(z.object({}).passthrough()) })
					.passthrough(),
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('sends list requests to the sandbox host when the plugin uses sandbox', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ contacts: [] }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		try {
			await makeFreeAgentPaginatedRequest(
				'/v2/contacts',
				{ key: 'access-token', options: { sandbox: true } },
				{},
				z.object({ contacts: z.array(z.unknown()) }).passthrough(),
			);
			expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
				'https://api.sandbox.freeagent.com/v2/contacts',
			);
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('keeps FreeAgent error messages on failed list requests', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					errors: { error: { message: 'You are not allowed' } },
				}),
				{ status: 403, headers: { 'Content-Type': 'application/json' } },
			),
		);
		try {
			await expect(
				makeFreeAgentPaginatedRequest(
					'/v2/tracking_groups',
					'access-token',
					{},
					z.object({}).passthrough(),
				),
			).rejects.toMatchObject({
				status: 403,
				body: { errors: { error: { message: 'You are not allowed' } } },
			});
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('uses the sandbox host from the endpoint context', async () => {
		mockedRequest.mockResolvedValue({ company: {} });
		await makeFreeAgentRequest('/v2/company', {
			key: 'access-token',
			options: { sandbox: true },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: FREEAGENT_SANDBOX_API_BASE }),
			expect.anything(),
		);
	});

	it('drops the sent body (contact details) from a rejected write', async () => {
		mockedRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/v2/contacts',
					body: { contact: { email: 'person@example.com' } },
				},
				{
					url: `${FREEAGENT_API_BASE}/v2/contacts`,
					ok: false,
					status: 422,
					statusText: 'Unprocessable Entity',
					body: { errors: [{ message: 'Invalid' }] },
				},
				'Unprocessable Entity',
			),
		);
		const error = await makeFreeAgentRequest('/v2/contacts', 'access-token', {
			method: 'POST',
			body: { contact: { email: 'person@example.com' } },
			// `unknown`: a rejection can carry any value; checked as ApiError below.
		}).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 422,
			body: { errors: [{ message: 'Invalid' }] },
		});
		expect(JSON.stringify(error)).not.toContain('person@example.com');
		expect((error as ApiError).request.body).toBeUndefined();
	});
});
