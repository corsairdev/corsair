import { slack } from '@corsair-dev/slack';
import { makeSlackRequest } from '@corsair-dev/slack/client';
import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { ApiResult } from '../async-core/ApiResult';
import { createCorsair } from '../core';
import { createTestDatabase } from './setup-db';

jest.mock('@corsair-dev/slack/client', () => {
	const original = jest.requireActual('@corsair-dev/slack/client');
	return {
		...original,
		makeSlackRequest: jest.fn(),
	};
});

const mockedMakeSlackRequest = makeSlackRequest as jest.MockedFunction<
	typeof makeSlackRequest
>;

function rateLimitApiError(): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: 'https://slack.com/api/conversations.list',
	};
	const response: ApiResult = {
		url: request.url,
		ok: false,
		status: 429,
		statusText: 'Too Many Requests',
		body: { error: 'rate_limited' },
	};
	return new ApiError(request, response, 'rate_limited', {});
}

describe('Endpoint retry', () => {
	let testDb: ReturnType<typeof createTestDatabase>;

	beforeEach(() => {
		testDb = createTestDatabase();
		jest.clearAllMocks();
	});

	afterEach(() => {
		testDb.cleanup();
	});

	it('returns the successful retried result instead of rethrowing the original error', async () => {
		let calls = 0;
		const recoveredChannelsList = {
			ok: true,
			channels: [{ id: 'C1', name: 'general' }],
		};

		mockedMakeSlackRequest.mockImplementation(async () => {
			calls += 1;
			if (calls === 1) {
				throw rateLimitApiError();
			}
			return recoveredChannelsList;
		});

		const corsair = createCorsair({
			kek: '',
			database: testDb.db,
			multiTenancy: false,
			plugins: [
				slack({
					authType: 'api_key',
					key: 'fake-key',
					errorHandlers: {
						RATE_LIMIT_ERROR: {
							match: (error) =>
								error instanceof ApiError && error.status === 429,
							handler: async () => ({ maxRetries: 2, headersRetryAfterMs: 1 }),
						},
					},
				}),
			],
		});

		const result = await corsair.slack.api.channels.list({});

		expect(mockedMakeSlackRequest).toHaveBeenCalledTimes(2);
		expect(result).toMatchObject({
			ok: true,
			channels: [{ id: 'C1', name: 'general' }],
		});
	});

	it('still throws an error when every retry fails', async () => {
		mockedMakeSlackRequest.mockRejectedValue(rateLimitApiError());

		const corsair = createCorsair({
			kek: '',
			database: testDb.db,
			multiTenancy: false,
			plugins: [
				slack({
					authType: 'api_key',
					key: 'fake-key',
					errorHandlers: {
						RATE_LIMIT_ERROR: {
							match: (error) =>
								error instanceof ApiError && error.status === 429,
							handler: async () => ({ maxRetries: 1, headersRetryAfterMs: 1 }),
						},
					},
				}),
			],
		});

		await expect(corsair.slack.api.channels.list({})).rejects.toMatchObject({
			name: 'ApiError',
			status: 429,
			message: 'rate_limited',
		});
		expect(mockedMakeSlackRequest).toHaveBeenCalledTimes(2);
	});
});
