import { BeaconchainAPIError } from './client';
import { errorHandlers } from './error-handlers';

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies a 429 as RATE_LIMIT_ERROR', () => {
		const error = new BeaconchainAPIError('rate limited');
		Object.assign(error, { status: 429 });
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies Too Many Requests as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(new Error('Too Many Requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('classifies 401 as AUTH_ERROR', () => {
		const error = new BeaconchainAPIError('unauthorized');
		Object.assign(error, { status: 401 });
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('classifies 500 as SERVER_ERROR', () => {
		const error = new BeaconchainAPIError('boom');
		Object.assign(error, { status: 500 });
		expect(matchedHandlerName(error)).toBe('SERVER_ERROR');
	});

	it('falls back to DEFAULT for an unrecognized error', () => {
		expect(matchedHandlerName(new Error('something unexpected'))).toBe(
			'DEFAULT',
		);
	});
});
