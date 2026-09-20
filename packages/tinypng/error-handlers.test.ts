import { TinypngAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('tinypng error handlers', () => {
	it('classifies HTTP 429 from TinypngAPIError as rate limited', () => {
		const error = new TinypngAPIError('Too Many Requests', 429);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('classifies HTTP 401 from TinypngAPIError as auth error', () => {
		const error = new TinypngAPIError('Unauthorized', 401);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});
});
