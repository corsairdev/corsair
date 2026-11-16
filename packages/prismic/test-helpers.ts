import type { PrismicContext } from './index';

/** Values only cast or narrowed, never read directly. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Awaits a promise expected to reject and returns the rejection reason, which
 * every caller narrows before reading a field. This is the suite's one place
 * that handles the untyped value, so no test needs its own cast.
 */
export async function captureError<T>(promise: Promise<T>): Promise<Untyped> {
	return promise.catch((caught: Untyped) => caught);
}

/**
 * A context with the repository and tokens every endpoint reads, and nothing
 * else. `apiKey` is the Migration API write token (`ctx.key`). `repository` and
 * `accessToken` are plugin options; `stored*` are the account's own fields.
 */
export function buildContext(
	overrides: {
		apiKey?: string;
		repository?: string | null;
		accessToken?: string;
		storedRepository?: string;
		storedAccessToken?: string;
	} = {},
): PrismicContext {
	const apiKey = overrides.apiKey ?? 'write-token';
	const repository =
		overrides.repository === null
			? undefined
			: (overrides.repository ?? 'my-cafe');
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: apiKey,
		options: {
			repository,
			accessToken: overrides.accessToken,
		},
		authType: 'api_key',
		keys: {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_api_key: () => Promise.resolve(apiKey),
			set_api_key: () => Promise.resolve(),
			get_repository: () => Promise.resolve(overrides.storedRepository ?? null),
			set_repository: () => Promise.resolve(),
			get_access_token: () =>
				Promise.resolve(overrides.storedAccessToken ?? null),
			set_access_token: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		// Only the fields above are read, and the real context carries more.
	} as Untyped as PrismicContext;
}
