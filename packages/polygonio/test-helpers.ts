import type { PolygonioContext } from './index';

/** A rejection reason before a caller narrows it with `toBeInstanceOf`. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Awaits a promise expected to reject and returns the rejection reason, which
 * every caller narrows before reading a field. This is the suite's one place
 * that handles the untyped value, so no test needs its own cast.
 */
export async function captureError<T>(promise: Promise<T>): Promise<Untyped> {
	return promise.catch((caught: Untyped) => caught);
}

/** A context with the key every endpoint reads, and nothing else. */
export function buildContext(apiKey = 'test-key'): PolygonioContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: apiKey,
		options: {},
		authType: 'api_key',
		keys: {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_api_key: () => Promise.resolve(apiKey),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		// Only the fields above are read, and the real context carries more.
	} as Untyped as PolygonioContext;
}
