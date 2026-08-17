import * as crypto from 'node:crypto';

// ─────────────────────────────────────────────────────────────────────────────
// OAuth State Encoding — HMAC-signed to prevent forged callbacks
// Extracted here so both oauth/index.ts and core/endpoints/bind.ts can import
// without creating circular dependencies.
// ─────────────────────────────────────────────────────────────────────────────

export type OAuthState = { plugin: string; tenantId: string; iat: number };

export function encodeOAuthState(plugin: string, tenantId: string): string {
	return Buffer.from(
		JSON.stringify({ plugin, tenantId, iat: Date.now() }),
	).toString('base64url');
}

export function decodeOAuthState(
	state: string,
	{ maxAgeMs }: { maxAgeMs?: number } = {},
): OAuthState | null {
	try {
		const payload = state.includes('.') ? state.split('.')[0] : state;
		const decoded = JSON.parse(
			Buffer.from(payload!, 'base64url').toString('utf-8'),
		) as unknown;
		if (
			decoded !== null &&
			typeof decoded === 'object' &&
			'plugin' in decoded &&
			'tenantId' in decoded &&
			typeof (decoded as OAuthState).plugin === 'string' &&
			typeof (decoded as OAuthState).tenantId === 'string'
		) {
			const result = decoded as OAuthState;
			if (
				maxAgeMs !== undefined &&
				typeof result.iat === 'number' &&
				Date.now() - result.iat > maxAgeMs
			) {
				return null;
			}
			return result;
		}
		return null;
	} catch {
		return null;
	}
}

export function signState(payload: string, kek: string): string {
	const sig = crypto
		.createHmac('sha256', kek)
		.update(payload)
		.digest('base64url');
	return `${payload}.${sig}`;
}

export const DEFAULT_CONNECT_LINK_TTL_MS = 10 * 60 * 1000;

export function verifyAndDecodeState(
	signed: string,
	kek: string,
): OAuthState | null {
	const dotIdx = signed.lastIndexOf('.');
	if (dotIdx === -1) return null;
	const payload = signed.slice(0, dotIdx);
	const sig = signed.slice(dotIdx + 1);
	const expected = crypto
		.createHmac('sha256', kek)
		.update(payload)
		.digest('base64url');
	const sigBuf = Buffer.from(sig, 'base64url');
	const expectedBuf = Buffer.from(expected, 'base64url');
	if (
		sigBuf.length !== expectedBuf.length ||
		!crypto.timingSafeEqual(sigBuf, expectedBuf)
	) {
		return null;
	}
	return decodeOAuthState(payload, { maxAgeMs: DEFAULT_CONNECT_LINK_TTL_MS });
}
