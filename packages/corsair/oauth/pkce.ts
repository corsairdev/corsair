import { createHash, createHmac } from 'node:crypto';

/**
 * PKCE (RFC 7636) for providers that require it (Canva), with nothing stored.
 *
 * The verifier is an HMAC under the project KEK, so the code that builds the
 * sign-in link and the code that exchanges the code can each make it without
 * passing it between them: the SDK keys it on the signed `state` it gets back,
 * and the CLI and Studio, which send no state, key it on plugin and tenant.
 * Nobody without the KEK can make it.
 */
export function pkceVerifier(seed: string, kek: string): string {
	if (!seed || !kek) throw new Error('PKCE needs a seed and the KEK');
	// 32 bytes in base64url: 43 characters, the shortest verifier RFC 7636 allows.
	return createHmac('sha256', kek)
		.update(`oauth-pkce-v1:${seed}`)
		.digest('base64url');
}

/** The verifier for a sign-in run on this machine (CLI, Studio), which sends no state. */
export function localPkceVerifier(
	pluginId: string,
	tenantId: string,
	kek: string,
): string {
	return pkceVerifier(`local:${pluginId}:${tenantId}`, kek);
}

/** The S256 challenge for a verifier: base64url(SHA-256(verifier)). */
export function pkceChallenge(verifier: string): string {
	return createHash('sha256').update(verifier).digest('base64url');
}

/**
 * The query params a PKCE sign-in link adds. `code_challenge_method` defaults
 * to S256; a provider that spells it differently (Canva: `s256`) sets it in
 * its authParams, which win.
 */
export function pkceAuthParams(
	verifier: string,
	authParams: Record<string, string> | undefined,
): Record<string, string> {
	return {
		code_challenge: pkceChallenge(verifier),
		code_challenge_method: authParams?.code_challenge_method ?? 'S256',
	};
}
