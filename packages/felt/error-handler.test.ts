import { ApiError } from 'corsair/http';
import { FeltAPIError } from './client';
import { errorHandlers, isNonIdempotent } from './error-handlers';

function makeFeltError(status: number, message: string) {
	return new FeltAPIError(message, String(status), {
		status,
		statusText: message,
	});
}

function makeApiError(status: number, message: string) {
	return new ApiError(
		{ method: 'GET', url: '/user' },
		{
			url: 'https://felt.com/api/v2/user',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
	);
}

describe('errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 status and too_many_requests message', () => {
			const statusErr = makeFeltError(429, 'Too many requests');
			const apiErr = makeApiError(429, 'Rate limited');
			const msgErr = new Error('too_many_requests code from provider');

			expect(errorHandlers.RATE_LIMIT_ERROR.match(statusErr)).toBe(true);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(apiErr)).toBe(true);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(msgErr)).toBe(true);
		});

		it('returns maxRetries: 0 so transport owns 429 retry backoff', async () => {
			const err = makeFeltError(429, 'Too many requests');
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 and 403 status and unauthorized messages', () => {
			const err401 = makeFeltError(401, 'Unauthorized token');
			const err403 = makeFeltError(403, 'Forbidden workspace');
			const msgErr = new Error('over_storage_limit on plan');

			expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(msgErr)).toBe(true);
		});

		it('returns maxRetries: 0 for auth errors', async () => {
			const err = makeFeltError(401, 'Unauthorized');
			const result = await errorHandlers.AUTH_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches 400 and 422 validation errors', () => {
			const err400 = makeFeltError(400, 'Bad Request');
			const err422 = makeFeltError(422, 'Unprocessable Entity');

			expect(errorHandlers.BAD_REQUEST_ERROR.match(err400)).toBe(true);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(err422)).toBe(true);
		});

		it('returns maxRetries: 0 for bad request errors', async () => {
			const err = makeFeltError(422, 'Invalid field');
			const result = await errorHandlers.BAD_REQUEST_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches 404 not found errors', () => {
			const err404 = makeFeltError(404, 'Map not found');
			const msgErr = new Error('resource not_found');

			expect(errorHandlers.NOT_FOUND_ERROR.match(err404)).toBe(true);
			expect(errorHandlers.NOT_FOUND_ERROR.match(msgErr)).toBe(true);
		});

		it('returns maxRetries: 0 for not found errors', async () => {
			const err = makeFeltError(404, 'Not found');
			const result = await errorHandlers.NOT_FOUND_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('SERVER_ERROR and isNonIdempotent', () => {
		it('identifies mutating write operations correctly', () => {
			expect(isNonIdempotent('felt.maps.create')).toBe(true);
			expect(isNonIdempotent('felt.maps.update')).toBe(true);
			expect(isNonIdempotent('felt.maps.delete')).toBe(true);
			expect(isNonIdempotent('felt.layers.upload')).toBe(true);
			expect(isNonIdempotent('felt.layers.delete')).toBe(true);
			expect(isNonIdempotent('felt.layerGroups.updateBulk')).toBe(true);
			expect(isNonIdempotent('felt.sources.createCredential')).toBe(true);

			expect(isNonIdempotent('felt.maps.get')).toBe(false);
			expect(isNonIdempotent('felt.layers.list')).toBe(false);
			expect(isNonIdempotent('felt.projects.list')).toBe(false);
			expect(isNonIdempotent('felt.users.getCurrent')).toBe(false);
		});

		it('returns maxRetries: 0 for non-idempotent mutating writes on 5xx', async () => {
			const err500 = makeFeltError(500, 'Internal Server Error');
			const result = await errorHandlers.SERVER_ERROR.handler(err500, {
				operation: 'felt.maps.create',
			});
			expect(result).toEqual({ maxRetries: 0 });
		});

		it('returns maxRetries: 0 for bulk writes such as layerGroups.updateBulk on 5xx', async () => {
			const err500 = makeFeltError(500, 'Internal Server Error');
			const result = await errorHandlers.SERVER_ERROR.handler(err500, {
				operation: 'felt.layerGroups.updateBulk',
			});
			expect(result).toEqual({ maxRetries: 0 });
		});

		it('returns maxRetries: 2 for safe read queries on 5xx', async () => {
			const err503 = makeFeltError(503, 'Service Unavailable');
			const result = await errorHandlers.SERVER_ERROR.handler(err503, {
				operation: 'felt.maps.get',
			});
			expect(result).toEqual({ maxRetries: 2 });
		});
	});

	describe('DEFAULT', () => {
		it('matches any uncaught error and returns maxRetries: 0', async () => {
			const generic = new Error('Something unexpected occurred');
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			const result = await errorHandlers.DEFAULT.handler();
			expect(result).toEqual({ maxRetries: 0 });
		});
	});
});
