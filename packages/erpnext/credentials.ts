/**
 * ERPNext credentials are scoped to one site: every deployment is its own
 * origin, and an API key/secret pair only works on the site that issued it.
 * Credentials and host must therefore be resolved from the same source.
 *
 * This module is the single definition of "explicitly configured credential"
 * used by both the key builder (which picks the credential) and the host
 * resolver (which picks the site origin). Keeping one definition is what
 * prevents an explicitly configured key pair from travelling to a
 * tenant-stored host — or the reverse.
 */

export type ErpnextCredentialOptions = {
	/**
	 * Compact credential: `<api_key>:<api_secret>` as one string, or a bare
	 * api key when `apiSecret` is set separately.
	 */
	key?: string;
	apiKey?: string;
	apiSecret?: string;
};

export type ExplicitErpnextCredential =
	/** The options carry a usable explicit pair. */
	| { kind: 'credential'; value: string }
	/** A compact `key` exists but is missing one half; unusable. */
	| { kind: 'malformed' }
	/** No explicit credentials; the tenant account supplies them. */
	| { kind: 'none' };

/**
 * Reads the credential configured directly on the plugin options.
 *
 * A compact `key` counts only when both halves are non-empty, matching the
 * credential the key builder would put on the wire. A bare `key` is an api
 * key and needs `apiSecret` beside it.
 */
export function explicitErpnextCredential(
	options: ErpnextCredentialOptions,
): ExplicitErpnextCredential {
	if (options.key !== undefined && options.key.includes(':')) {
		const [keyPart, secretPart] = options.key.split(':');
		if (!keyPart || !secretPart) return { kind: 'malformed' };
		return { kind: 'credential', value: options.key };
	}
	const apiKey = options.apiKey ?? options.key;
	if (apiKey && options.apiSecret) {
		return { kind: 'credential', value: `${apiKey}:${options.apiSecret}` };
	}
	return { kind: 'none' };
}
