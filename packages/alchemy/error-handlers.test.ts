
import { errorHandlers } from './error-handlers';
import { AlchemyAPIError } from './client';

describe('Alchemy error handlers', () => {
	it('matches RATE_LIMIT_ERROR on 429', () => {
		const error = new AlchemyAPIError('Too Many Requests', { status: 429 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('matches RATE_LIMIT_ERROR on message', () => {
		const error = new Error('Rate limit exceeded');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('matches AUTH_ERROR on 401 and 403', () => {
		const err401 = new AlchemyAPIError('Unauthorized', { status: 401 });
		const err403 = new AlchemyAPIError('Forbidden', { status: 403 });
		expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);
	});

	it('matches AUTH_ERROR on message', () => {
		const error = new Error('Invalid API key provided');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('matches BAD_REQUEST_ERROR on 400', () => {
		const error = new AlchemyAPIError('Bad Request', { status: 400 });
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
	});

	it('matches BAD_REQUEST_ERROR on JSON-RPC invalid params code', () => {
		const error = new AlchemyAPIError('Invalid params', { code: -32602 });
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
	});
});
