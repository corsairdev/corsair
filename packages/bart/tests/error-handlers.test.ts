import { BartAPIError } from '../client';
import { errorHandlers } from '../error-handlers';

describe('BART Error Handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 status and rate limit messages', () => {
			const handler = errorHandlers.RATE_LIMIT_ERROR;
			expect(handler.match(new BartAPIError('Rate limit', 429))).toBe(true);
			expect(handler.match(new Error('Rate limited by BART server'))).toBe(
				true,
			);
			expect(handler.match(new Error('429 Too Many Requests'))).toBe(false);
			expect(handler.match(new Error('Station 429 does not exist'))).toBe(
				false,
			);
			expect(handler.match(new Error('Station not found'))).toBe(false);
		});

		it('extracts retryAfter from error and does not retry at the endpoint layer', async () => {
			const handler = errorHandlers.RATE_LIMIT_ERROR;
			const err = new BartAPIError('rate limit', 429, { retryAfter: 30000 });
			const res = await handler.handler(err);
			expect(res.maxRetries).toBe(0);
			expect(res.headersRetryAfterMs).toBe(30000);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 status and auth messages', () => {
			const handler = errorHandlers.AUTH_ERROR;
			expect(handler.match(new BartAPIError('Unauthorized', 401))).toBe(true);
			expect(handler.match(new Error('Invalid API key provided'))).toBe(true);
			expect(handler.match(new Error('invalid key'))).toBe(true);
			expect(handler.match(new Error('random error'))).toBe(false);
		});

		it('returns 0 retries for auth errors', async () => {
			const res = await errorHandlers.AUTH_ERROR.handler(
				new Error('unauthorized'),
			);
			expect(res.maxRetries).toBe(0);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches 404 status and not found messages', () => {
			const handler = errorHandlers.NOT_FOUND_ERROR;
			expect(handler.match(new BartAPIError('Not found', 404))).toBe(true);
			expect(handler.match(new Error('Station does not exist'))).toBe(true);
			expect(handler.match(new Error('Route not found'))).toBe(true);
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches 400 status and bad request messages', () => {
			const handler = errorHandlers.BAD_REQUEST_ERROR;
			expect(handler.match(new BartAPIError('Bad request', 400))).toBe(true);
			expect(handler.match(new Error('invalid station 12TH'))).toBe(true);
			expect(handler.match(new Error('invalid origin'))).toBe(true);
		});
	});

	describe('DEFAULT', () => {
		it('always matches fallback errors', async () => {
			expect(errorHandlers.DEFAULT.match(new Error('unknown'))).toBe(true);
			const res = await errorHandlers.DEFAULT.handler(new Error('unknown'));
			expect(res.maxRetries).toBe(0);
		});
	});
});
