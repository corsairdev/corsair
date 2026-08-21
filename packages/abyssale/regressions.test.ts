import { ApiError, request } from 'corsair/http';
import { AbyssaleAPIError } from './client';
import { Auth, Designs, Projects } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { AbyssaleContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.Mock;
const ctx = { key: 'k', options: {}, db: {} } as unknown as AbyssaleContext;

function transportError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/designs' } as never,
		{
			url: '/designs',
			ok: false,
			status,
			statusText: message,
			body: {},
		} as never,
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => mockRequest.mockReset());

describe('a successful retry returns its result', () => {
	// Retrying via the shared binder would discard the successful attempt and
	// rethrow the original error, so the retry lives in client.ts.
	it('returns the retry result after a 429', async () => {
		mockRequest
			.mockRejectedValueOnce(transportError(429, 'Too Many Requests', 1))
			.mockResolvedValueOnce([]);

		await expect(Designs.getDesigns(ctx, {})).resolves.toEqual([]);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('retries a 429 on a mutation too', async () => {
		mockRequest
			.mockRejectedValueOnce(transportError(429, 'Too Many Requests', 1))
			.mockResolvedValueOnce({
				id: '08eafd16-9d61-11f1-b748-06b6ae795cdb',
				name: 'n',
				created_at_ts: 1,
			});

		await expect(
			Projects.createProject(ctx, { name: 'demo' }),
		).resolves.toMatchObject({ id: '08eafd16-9d61-11f1-b748-06b6ae795cdb' });
	});

	it('never replays a 5xx on a mutation', async () => {
		mockRequest.mockRejectedValue(transportError(503, 'Service Unavailable'));

		await expect(
			Projects.createProject(ctx, { name: 'demo' }),
		).rejects.toThrow();
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('asks the binder for no retries', async () => {
		const err = new AbyssaleAPIError('Too Many Requests', undefined, {
			cause: transportError(429, 'Too Many Requests'),
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		expect((await errorHandlers.RATE_LIMIT_ERROR.handler()).maxRetries).toBe(0);
	});
});

describe('declared schemas are enforced at runtime', () => {
	// The endpoint binder does not parse `endpointSchemas`, so the endpoints
	// validate themselves.
	it('rejects an input that violates the declared schema', async () => {
		await expect(
			Projects.createProject(ctx, { name: 'x' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an unknown design type filter', async () => {
		await expect(
			Designs.getDesigns(ctx, { type: 'bogus' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a provider payload that breaks the contract', async () => {
		mockRequest.mockResolvedValueOnce({ nope: true });
		await expect(Auth.testAuth(ctx, {})).rejects.toThrow();
	});

	it('accepts a valid payload and passes newer fields through', async () => {
		mockRequest.mockResolvedValueOnce({
			company: 'acme',
			version: 'v1',
			brand_new: 1,
		});
		await expect(Auth.testAuth(ctx, {})).resolves.toMatchObject({
			company: 'acme',
			brand_new: 1,
		});
	});
});
