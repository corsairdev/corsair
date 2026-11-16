import type { PointagramContext } from './index';

/**
 * Awaits a promise expected to reject and returns the rejection reason.
 *
 * The reason has no static type, which is why this is the one place in the
 * suite that names it: every caller narrows it with `toBeInstanceOf` before
 * reading a field.
 */
export async function captureError<T>(
	promise: Promise<T>,
	// unknown: a rejection reason has no static type until it is narrowed.
): Promise<unknown> {
	// unknown: see above.
	return promise.catch(
		(caught: unknown) => caught, // unknown: see above.
	);
}

/** A context with the credentials every endpoint reads, and nothing else. */
export function buildContext(
	overrides: { apiKey?: string; apiUser?: string } = {},
): PointagramContext {
	const apiKey = overrides.apiKey ?? 'key-abc';
	const apiUser = overrides.apiUser ?? 'ops@example.com';
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: apiKey,
		authType: 'api_key',
		keys: {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_api_key: () => Promise.resolve(apiKey),
			set_api_key: () => Promise.resolve(),
			get_api_user: () => Promise.resolve(apiUser),
			set_api_user: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	} as unknown as PointagramContext; // unknown: only the fields above are read.
}
