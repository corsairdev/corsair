import { ApiError, request } from 'corsair/http';
import {
	AnthropicAdministratorAPIError,
	makeAnthropicAdministratorRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.Mock;

beforeEach(() => {
	mockRequest.mockReset();
});

/** Builds the error corsair/http actually throws for a given status. */
function transportError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/organizations/users' } as never,
		{
			url: '/v1/organizations/users',
			ok: false,
			status,
			statusText: message,
			body: { type: 'error', error: { type: 'rate_limit_error', message } },
		} as never,
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

/** Wraps it the way client.ts does. */
function wrapped(
	status: number,
	message: string,
	method: 'GET' | 'POST' | 'DELETE' = 'GET',
	retryAfter?: number,
) {
	const cause = transportError(status, message, retryAfter);
	return new AnthropicAdministratorAPIError(cause.message, { cause, method });
}

describe('client-side retry returns the successful attempt', () => {
	const okBody = { id: 'org_1', name: 'Acme', type: 'organization' };

	function rateLimited(retryAfterMs?: number) {
		return transportError(429, 'Too Many Requests', retryAfterMs);
	}

	it('returns the retry result instead of the first failure', async () => {
		mockRequest
			.mockRejectedValueOnce(rateLimited(1))
			.mockResolvedValueOnce(okBody);

		await expect(
			makeAnthropicAdministratorRequest('/v1/organizations/me', 'k'),
		).resolves.toEqual(okBody);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('retries a 429 on a mutation too — it was rejected before being applied', async () => {
		mockRequest
			.mockRejectedValueOnce(rateLimited(1))
			.mockResolvedValueOnce({ ok: true });

		await expect(
			makeAnthropicAdministratorRequest('/v1/organizations/invites', 'k', {
				method: 'POST',
				body: { email: 'a@b.com', role: 'user' },
			}),
		).resolves.toEqual({ ok: true });
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('never replays a 5xx on a mutation', async () => {
		mockRequest.mockRejectedValue(transportError(503, 'Service Unavailable'));

		await expect(
			makeAnthropicAdministratorRequest('/v1/organizations/invites', 'k', {
				method: 'POST',
			}),
		).rejects.toThrow('Service Unavailable');
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('retries a 5xx on GET', async () => {
		mockRequest
			.mockRejectedValueOnce(transportError(500, 'Internal Server Error'))
			.mockResolvedValueOnce(okBody);

		await expect(
			makeAnthropicAdministratorRequest('/v1/organizations/me', 'k'),
		).resolves.toEqual(okBody);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('gives up after the attempt budget and surfaces the failure', async () => {
		mockRequest.mockRejectedValue(rateLimited(1));

		await expect(
			makeAnthropicAdministratorRequest('/v1/organizations/me', 'k'),
		).rejects.toThrow('Too Many Requests');
		expect(mockRequest).toHaveBeenCalledTimes(3);
	});

	it('does not retry an auth failure', async () => {
		mockRequest.mockRejectedValue(transportError(401, 'Unauthorized'));

		await expect(
			makeAnthropicAdministratorRequest('/v1/organizations/me', 'k'),
		).rejects.toThrow('Unauthorized');
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

describe('request path bounds', () => {
	it('rejects an over-long path before it reaches the transport', async () => {
		const huge = `/v1/organizations/users/${'a'.repeat(600)}`;

		await expect(makeAnthropicAdministratorRequest(huge, 'k')).rejects.toThrow(
			'exceeds 512 characters',
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('never forwards unmatched braces to the transport', async () => {
		// Paths are built by interpolating percent-encoded IDs, so a brace can
		// never survive into the request path.
		mockRequest.mockResolvedValueOnce({});
		const { anthropicAdministratorEndpointsNested: ops } = await import(
			'./index'
		);
		const groups = ops as unknown as Record<
			string,
			Record<string, (c: unknown, i: unknown) => Promise<unknown>>
		>;

		const getUser = groups.users?.getUser;
		if (!getUser) throw new Error('missing endpoint');
		await getUser(
			{ key: 'k', options: {}, db: {} },
			{ user_id: '{a'.repeat(50) },
		);

		const url = mockRequest.mock.calls[0]?.[1]?.url as string;
		expect(url).not.toContain('{');
		expect(url).not.toContain('}');
	});

	it('accepts a normal path', async () => {
		mockRequest.mockResolvedValueOnce({});
		await expect(
			makeAnthropicAdministratorRequest('/v1/organizations/me', 'k'),
		).resolves.toEqual({});
	});
});

describe('error classification', () => {
	it('classifies a 429 by status, not by message text', () => {
		// corsair throws 429 with the literal message "Too Many Requests" — it
		// contains neither "429" nor "rate_limited", so status must be preserved.
		const error = wrapped(429, 'Too Many Requests', 'GET', 30_000);

		expect(error.message).toBe('Too Many Requests');
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(30_000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('asks the binder for no retries — the client already retried', async () => {
		// Delegating retries to the shared binder would discard a successful
		// retry and rethrow the original failure.
		// AUTH_ERROR logs guidance; keep the assertion output clean.
		const consoleError = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		// Handlers have mixed arity; drive them uniformly.
		const handlers = [
			errorHandlers.RATE_LIMIT_ERROR,
			errorHandlers.SERVER_ERROR,
			errorHandlers.AUTH_ERROR,
			errorHandlers.NOT_FOUND_ERROR,
			errorHandlers.INVALID_REQUEST_ERROR,
			errorHandlers.DEFAULT,
		] as unknown as Array<{
			handler: (error: Error) => Promise<{ maxRetries: number }>;
		}>;

		for (const { handler } of handlers) {
			expect(
				(await handler(wrapped(500, 'Internal Server Error'))).maxRetries,
			).toBe(0);
		}

		consoleError.mockRestore();
	});

	it('matches auth, not-found, invalid-request and server errors by status', () => {
		expect(errorHandlers.AUTH_ERROR.match(wrapped(401, 'Unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(wrapped(403, 'Forbidden'))).toBe(
			true,
		);
		expect(errorHandlers.NOT_FOUND_ERROR.match(wrapped(404, 'Not Found'))).toBe(
			true,
		);
		expect(
			errorHandlers.INVALID_REQUEST_ERROR.match(wrapped(400, 'Bad Request')),
		).toBe(true);
		expect(
			errorHandlers.SERVER_ERROR.match(wrapped(503, 'Service Unavailable')),
		).toBe(true);
	});

	it('surfaces the Anthropic error type from the response body', () => {
		expect(wrapped(429, 'Too Many Requests').errorType).toBe(
			'rate_limit_error',
		);
	});
});
