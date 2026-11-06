import { AdyntelAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function adyntelError(
	status: number | undefined,
	operation: string,
	retryAfter?: number,
) {
	return new AdyntelAPIError('failed', {
		status,
		operation,
		retryAfter,
		method: 'POST',
	});
}

// unknown: a handler's return shape is the plugin's retry policy, read one key
// at a time in the assertions below.
async function run(
	handler: (typeof errorHandlers)[keyof typeof errorHandlers],
	error: Error,
) {
	return (await handler.handler(error)) as Record<string, unknown>;
}

describe('error handlers', () => {
	it('retries a 429 on a read and honours Retry-After', async () => {
		const policy = await run(
			errorHandlers.RATE_LIMIT_ERROR,
			adyntelError(429, 'linkedinAds', 3000),
		);

		expect(policy.maxRetries).toBe(3);
		expect(policy.headersRetryAfterMs).toBe(3000);
	});

	it('does not retry a 429 when no operation is known', async () => {
		const policy = await run(
			errorHandlers.RATE_LIMIT_ERROR,
			new AdyntelAPIError('x'),
		);

		expect(policy.maxRetries).toBe(0);
	});

	it('does not retry an unknown operation, because it cannot be proven a read', async () => {
		const policy = await run(
			errorHandlers.RATE_LIMIT_ERROR,
			adyntelError(429, 'someFutureWrite'),
		);

		expect(policy.maxRetries).toBe(0);
	});

	it('does not retry a 401', async () => {
		expect(errorHandlers.AUTH_ERROR.match(adyntelError(401, 'googleAds'))).toBe(
			true,
		);
		expect(
			(await run(errorHandlers.AUTH_ERROR, adyntelError(401, 'googleAds')))
				.maxRetries,
		).toBe(0);
	});

	it('does not retry a 402, because there are no credits to spend', async () => {
		expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.match(
				adyntelError(402, 'linkedinAds'),
			),
		).toBe(true);
		expect(
			(
				await run(
					errorHandlers.INSUFFICIENT_CREDITS_ERROR,
					adyntelError(402, 'linkedinAds'),
				)
			).maxRetries,
		).toBe(0);
	});

	it('does not retry a 422 or a 400, which nothing was charged for', async () => {
		expect(
			errorHandlers.VALIDATION_ERROR.match(adyntelError(422, 'facebookAds')),
		).toBe(true);
		expect(
			errorHandlers.VALIDATION_ERROR.match(adyntelError(400, 'facebookAds')),
		).toBe(true);
		expect(
			(await run(errorHandlers.VALIDATION_ERROR, adyntelError(422, 'x')))
				.maxRetries,
		).toBe(0);
	});

	it('treats a ZodError as a validation error', () => {
		const zodError = new Error('bad input');
		zodError.name = 'ZodError';

		expect(errorHandlers.VALIDATION_ERROR.match(zodError)).toBe(true);
	});

	it('retries a 5xx on a read only', async () => {
		expect(
			(await run(errorHandlers.SERVER_ERROR, adyntelError(503, 'linkedinAds')))
				.maxRetries,
		).toBe(2);
		expect(
			(
				await run(
					errorHandlers.SERVER_ERROR,
					adyntelError(503, 'someFutureWrite'),
				)
			).maxRetries,
		).toBe(0);
	});

	it('retries a network failure on a read only', async () => {
		expect(
			(
				await run(
					errorHandlers.NETWORK_ERROR,
					adyntelError(undefined, 'linkedinAds'),
				)
			).maxRetries,
		).toBe(2);
		expect(
			(
				await run(
					errorHandlers.NETWORK_ERROR,
					adyntelError(undefined, 'someFutureWrite'),
				)
			).maxRetries,
		).toBe(0);
	});

	it('does not treat a provider rejection as a network failure', async () => {
		const rejection = new AdyntelAPIError('code 40001', {
			operation: 'tiktokSearch',
			providerCode: 40001,
		});

		// A non-zero code arrives with a 200, so it has no status either. It must
		// not match NETWORK_ERROR, which would retry a call already billed.
		expect(rejection.status).toBeUndefined();
		expect(errorHandlers.NETWORK_ERROR.match(rejection)).toBe(false);
		expect(errorHandlers.PROVIDER_REJECTION_ERROR.match(rejection)).toBe(true);
		expect(
			(await run(errorHandlers.PROVIDER_REJECTION_ERROR, rejection)).maxRetries,
		).toBe(0);
	});

	it('does not retry a job-starting read, because a repeat can queue a second job', async () => {
		// `googleAds`, `googleShopping`, `tiktokAds` and `facebookAds` all enqueue
		// work that spends a credit, so an unknown outcome is never replayed.
		for (const operation of [
			'facebookAds',
			'googleAds',
			'googleShopping',
			'tiktokAds',
		]) {
			const policy = await run(
				errorHandlers.NETWORK_ERROR,
				adyntelError(undefined, operation),
			);
			expect(policy.maxRetries).toBe(0);
		}
	});

	it('still retries a read that cannot start a job', async () => {
		for (const operation of [
			'linkedinAds',
			'linkedinKeywordSearch',
			'googleShoppingStatus',
			'domainKeywords',
		]) {
			const policy = await run(
				errorHandlers.NETWORK_ERROR,
				adyntelError(undefined, operation),
			);
			expect(policy.maxRetries).toBe(2);
		}
	});

	it('does not retry a 404', async () => {
		expect(errorHandlers.NOT_FOUND_ERROR.match(adyntelError(404, 'x'))).toBe(
			true,
		);
	});

	it('matches every Adyntel error in one handler, with DEFAULT as the catch-all', () => {
		const error = adyntelError(418, 'googleAds');
		const matched = Object.values(errorHandlers).filter((handler) =>
			handler.match(error),
		);

		expect(matched).toHaveLength(1);
		expect(matched[0]).toBe(errorHandlers.DEFAULT);
	});

	it('DEFAULT is the last key', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	const custom = {
		CUSTOM_ERROR: {
			match: () => false,
			handler: async () => ({ maxRetries: 0 }),
		},
	};

	it('returns the builtin set unchanged when there is nothing to merge', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts a caller key first so its handler wins an overlapping match', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(Object.keys(merged)[0]).toBe('CUSTOM_ERROR');
		expect(merged.CUSTOM_ERROR).toBe(custom.CUSTOM_ERROR);
	});

	it('keeps every builtin key', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		for (const name of Object.keys(errorHandlers)) {
			expect(merged).toHaveProperty(name);
		}
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('lets a caller override a builtin handler by reusing its key', () => {
		const override = {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 7 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, override);

		expect(merged.AUTH_ERROR).toBe(override.AUTH_ERROR);
		expect(Object.keys(merged).filter((k) => k === 'AUTH_ERROR')).toHaveLength(
			1,
		);
	});

	it('prefers a caller DEFAULT but still puts it last', () => {
		const withDefault = {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, withDefault);

		expect(merged.DEFAULT).toBe(withDefault.DEFAULT);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});
});
