import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FREEAGENT_API_BASE,
	FREEAGENT_SANDBOX_API_BASE,
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
});
