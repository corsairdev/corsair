import { ApiError } from 'corsair/http';
import { RailwayGraphQLError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number) {
	return new ApiError(
		{ method: 'POST', url: '/graphql/v2' },
		{
			url: 'https://backboard.railway.com/graphql/v2',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		`Railway ${status}`,
	);
}

describe('error handlers', () => {
	it('leaves 429 retries to core', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('maps GraphQL errors from a 200 by their message', () => {
		const denied = new RailwayGraphQLError(['Not Authorized'], [''], ['me']);
		expect(denied.status).toBe(403);
		expect(errorHandlers.AUTH_ERROR.match(denied)).toBe(true);
		const missing = new RailwayGraphQLError(
			['Project not found'],
			[''],
			['project'],
		);
		expect(missing.status).toBe(404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(missing)).toBe(true);
		const bad = new RailwayGraphQLError(
			['Invalid input'],
			[''],
			['projectCreate'],
		);
		expect(bad.status).toBe(400);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(bad)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(bad)).toBe(false);
	});

	it('never retries auth, missing or invalid requests, nor a 5xx it cannot prove was a query', async () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(400))).toBe(true);
		await expect(
			errorHandlers.SERVER_ERROR.handler(apiError(502)),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
