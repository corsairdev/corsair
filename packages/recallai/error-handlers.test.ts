import { RecallaiAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Recall.ai rate-limit handling', () => {
	it('recognizes wrapped 429 responses and preserves Retry-After', async () => {
		const error = new RecallaiAPIError(
			'Too Many Requests',
			429,
			undefined,
			2500,
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2500,
		});
	});

	it('does not treat other provider errors as rate limits', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new RecallaiAPIError('Unauthorized', 401),
			),
		).toBe(false);
	});

	it('classifies wrapped 401 responses as authentication failures', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(new RecallaiAPIError('Unauthorized', 401)),
		).toBe(true);
	});
});
