import { ApiError, request } from 'corsair/http';
import { HERE_HOSTS, makeHereRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockedRequest = request as jest.MockedFunction<typeof request>;

describe('HERE client', () => {
	it('keeps HTTP status and Retry-After on ApiError', async () => {
		mockedRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/v1/geocode' },
				{
					url: 'https://geocode.search.hereapi.com/v1/geocode',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: null,
				} as any,
				'Too Many Requests',
				{ retryAfter: 1500 },
			),
		);

		await expect(
			makeHereRequest(HERE_HOSTS.geocode, '/v1/geocode', 'k', {
				query: { q: 'Berlin' },
			}),
		).rejects.toMatchObject({
			name: 'HereAPIError',
			status: 429,
			retryAfter: 1500,
		});
	});
});
