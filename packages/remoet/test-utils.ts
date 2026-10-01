import { ApiError } from 'corsair/http';
import { RemoetAPIError } from './client';
import type { RemoetContext } from './index';

/** The fixed API key every mocked-request unit test signs requests with. */
export const TEST_KEY = 'remoet-test-key';

/**
 * Fully-typed test context: every field of RemoetContext is provided with an
 * inert stub, so no type assertion is needed. Endpoint implementations only
 * read ctx.key; the rest satisfies the type checker.
 */
export function testContext(key: string = TEST_KEY): RemoetContext {
	return {
		db: {},
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(key),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
	};
}

/** The error the client throws for a Remoet error response, for mocking a failed request. */
export function remoetError(status: number, message: string): RemoetAPIError {
	const cause = new ApiError(
		{ method: 'GET', url: '/user' },
		{
			url: 'https://api.remoet.dev/user',
			ok: false,
			status,
			statusText: '',
			body: { statusCode: status, message },
		},
		message,
	);
	return new RemoetAPIError(message, { cause });
}
