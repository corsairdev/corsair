import { ApiError } from 'corsair/http';
import { makeConnecteamRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const { request } = jest.requireMock('corsair/http') as {
	request: jest.Mock;
};

describe('Connecteam client', () => {
	it('rethrows ApiError so 429 handlers keep status and retryAfter', async () => {
		const err = new ApiError(
			{ method: 'GET', url: 'me' },
			{
				url: 'https://api.connecteam.com/me',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		request.mockRejectedValue(err);

		await expect(makeConnecteamRequest('me', 'k')).rejects.toBe(err);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
	});
});
