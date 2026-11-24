import { createHash, hkdfSync, randomBytes } from 'node:crypto';

/**
 * PKCE (RFC 7636) for providers that require it (Canva), with nothing stored.
 *
 * The verifier is derived from the project KEK with HKDF, so the code that
 * builds the sign-in link and the code that exchanges the code can each make
 * it without passing it between them. The SDK derives it from the signed
 * `state`, which is new for every sign-in and comes back at the callback.
 * Nobody without the KEK can make it.
 */
export function pkceVerifier(seed: string, kek: string): string {
	if (!seed || !kek) throw new Error('PKCE needs a seed and the KEK');
	// 32 bytes in base64url: 43 characters, the shortest verifier RFC 7636 allows.
	const key = hkdfSync('sha256', kek, 'corsair-oauth-pkce', `v1:${seed}`, 32);
	return Buffer.from(key).toString('base64url');
}

/** A fresh value for one local sign-in, so no two sign-ins share a verifier. */
export function newPkceNonce(): string {
	return randomBytes(16).toString('base64url');
}

/**
 * The verifier for a sign-in run on this machine (CLI, Studio), which sends no
 * state. The nonce is new for each sign-in and kept until its code is exchanged.
 */
export function localPkceVerifier(
	pluginId: string,
	tenantId: string,
	kek: string,
	nonce: string,
): string {
	if (!nonce) throw new Error('A local PKCE sign-in needs its nonce');
	return pkceVerifier(`local:${pluginId}:${tenantId}:${nonce}`, kek);
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
