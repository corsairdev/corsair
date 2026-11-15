import type { ProabonoContext } from './index';

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

/** A context with the two keys and the account number every endpoint reads. */
export function buildContext(
	overrides: {
		apiKey?: string;
		agentKey?: string;
		/** The `account` plugin option; `null` leaves it unset. */
		account?: string | null;
		/** The stored `account` field. */
		storedAccount?: string | null;
	} = {},
): ProabonoContext {
	const apiKey = overrides.apiKey ?? 'api-key';
	const agentKey = overrides.agentKey ?? 'agent-key';
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: apiKey,
		// The account number may be a plugin option. The two credentials are read
		// from `ctx.key` and the account's `agent_key`, never from here, so leaving
		// them out is what a real context looks like.
		options:
			overrides.account === null ? {} : { account: overrides.account ?? '42' },
		authType: 'api_key',
		keys: {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_api_key: () => Promise.resolve(apiKey),
			set_api_key: () => Promise.resolve(),
			get_agent_key: () => Promise.resolve(agentKey),
			set_agent_key: () => Promise.resolve(),
			get_account: () => Promise.resolve(overrides.storedAccount ?? null),
			set_account: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		// Only the fields above are read, and the real context carries more.
	} as Untyped as ProabonoContext;
}
