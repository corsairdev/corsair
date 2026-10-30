import {
	AnthropicAdministratorAPIError,
	makeAnthropicAdministratorRequest,
} from './client';
import { errorHandlers } from './error-handlers';
import { anthropicAdministratorEndpointsNested as api } from './index';
import {
	jsonResponse,
	makeContext,
	sentRequest,
	stubFetch,
} from './test-helpers';

const USER = {
	id: 'user_1',
	added_at: '2026-01-01T00:00:00Z',
	email: 'ada@acme.dev',
	name: 'Ada',
	role: 'developer',
	type: 'user',
};

function anthropicError(status: number, type: string, message: string) {
	return jsonResponse(status, { type: 'error', error: { type, message } });
}

function rateLimited(retryAfterSeconds: string) {
	return jsonResponse(
		429,
		{
			type: 'error',
			error: { type: 'rate_limit_error', message: 'Rate limited' },
		},
		{ 'retry-after': retryAfterSeconds },
	);
}

/** Runs `promise` while fake time advances, so retry sleeps finish instantly. */
async function settle<T>(promise: Promise<T>, ms: number) {
	const outcome = promise.then(
		(value) => ({ ok: true as const, value }),
		(error: Error) => ({ ok: false as const, error }),
	);
	await jest.advanceTimersByTimeAsync(ms);
	return outcome;
}

beforeEach(() => {
	jest.useFakeTimers();
	jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('401 authentication failure', () => {
	it('fails once with the status and Anthropic error type', async () => {
		const fetchMock = stubFetch(
			anthropicError(401, 'authentication_error', 'invalid x-api-key'),
		);
		const { ctx } = makeContext();

		const outcome = await settle(
			api.users.getUser(ctx, { user_id: 'user_1' }),
			0,
		);

		expect(outcome.ok).toBe(false);
		if (outcome.ok) return;
		expect(outcome.error).toBeInstanceOf(AnthropicAdministratorAPIError);
		expect(outcome.error).toMatchObject({
			status: 401,
			errorType: 'authentication_error',
			method: 'GET',
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(errorHandlers.AUTH_ERROR.match(outcome.error)).toBe(true);
	});
});

describe('429 with Retry-After', () => {
	it('waits the Retry-After interval, then returns the retried result', async () => {
		const fetchMock = stubFetch(rateLimited('2'), jsonResponse(200, USER));
		const { ctx } = makeContext();

		const pending = api.users.getUser(ctx, { user_id: 'user_1' });
		await jest.advanceTimersByTimeAsync(1999);
		expect(fetchMock).toHaveBeenCalledTimes(1);

		const outcome = await settle(pending, 1);
		expect(outcome).toEqual({ ok: true, value: USER });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('retries a 429 on a mutation, since it was rejected before being applied', async () => {
		const fetchMock = stubFetch(
			rateLimited('1'),
			jsonResponse(200, { ...USER, role: 'admin' }),
		);
		const { ctx } = makeContext();

		const outcome = await settle(
			api.users.updateUser(ctx, { user_id: 'user_1', role: 'admin' }),
			1000,
		);

		expect(outcome).toEqual({ ok: true, value: { ...USER, role: 'admin' } });
		expect(sentRequest(fetchMock, 1).body).toEqual({ role: 'admin' });
	});

	it('gives up after three attempts and surfaces the rate limit', async () => {
		const fetchMock = stubFetch(
			rateLimited('1'),
			rateLimited('1'),
			rateLimited('1'),
		);
		const { ctx } = makeContext();

		const outcome = await settle(
			api.users.getUser(ctx, { user_id: 'user_1' }),
			5000,
		);

		expect(fetchMock).toHaveBeenCalledTimes(3);
		expect(outcome.ok).toBe(false);
		if (outcome.ok) return;
		expect(outcome.error).toMatchObject({
			status: 429,
			retryAfter: 1000,
			errorType: 'rate_limit_error',
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(outcome.error)).toBe(true);
	});
});

describe('5xx', () => {
	it('retries a GET', async () => {
		const fetchMock = stubFetch(
			anthropicError(529, 'overloaded_error', 'Overloaded'),
			jsonResponse(200, USER),
		);
		const { ctx } = makeContext();

		const outcome = await settle(
			api.users.getUser(ctx, { user_id: 'user_1' }),
			1000,
		);

		expect(outcome).toEqual({ ok: true, value: USER });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('never replays a mutation, which may already have been applied', async () => {
		const fetchMock = stubFetch(
			anthropicError(500, 'api_error', 'Internal server error'),
		);
		const { ctx } = makeContext();

		const outcome = await settle(
			api.users.updateUser(ctx, { user_id: 'user_1', role: 'admin' }),
			5000,
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(outcome.ok).toBe(false);
		if (outcome.ok) return;
		expect(outcome.error).toMatchObject({ status: 500, method: 'POST' });
		expect(errorHandlers.SERVER_ERROR.match(outcome.error)).toBe(true);
	});
});

describe('error classification', () => {
	function apiError(status: number) {
		const fetchMock = stubFetch(anthropicError(status, 'x_error', 'failed'));
		return settle(
			makeAnthropicAdministratorRequest('/v1/organizations/me', 'k', {
				method: 'POST',
			}),
			0,
		).then((outcome) => {
			fetchMock.mockRestore();
			if (outcome.ok) throw new Error('expected a failure');
			return outcome.error;
		});
	}

	it('matches not-found and invalid-request errors by status', async () => {
		expect(errorHandlers.NOT_FOUND_ERROR.match(await apiError(404))).toBe(true);
		expect(errorHandlers.INVALID_REQUEST_ERROR.match(await apiError(400))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(await apiError(403))).toBe(true);
	});

	it('asks the binder for no retries, since the client already retried', async () => {
		const error = await apiError(500);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('request path bounds', () => {
	it('rejects an over-long path before any request is sent', async () => {
		const fetchMock = stubFetch();

		await expect(
			makeAnthropicAdministratorRequest(`/v1/x/${'a'.repeat(600)}`, 'k'),
		).rejects.toThrow('exceeds 512 characters');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('percent-encodes IDs so braces never reach the request path', async () => {
		const fetchMock = stubFetch(jsonResponse(200, USER));
		const { ctx } = makeContext();

		await settle(api.users.getUser(ctx, { user_id: '{a}' }), 0);

		expect(sentRequest(fetchMock).url).toBe(
			'https://api.anthropic.com/v1/organizations/users/%7Ba%7D',
		);
	});
});
