/**
 * URL validation for outbound OAuth requests (token exchange, refresh).
 *
 * Prevents SSRF by rejecting URLs that point to private networks, cloud
 * metadata services, or use non-HTTPS schemes. Applied to every `tokenUrl`
 * before the SDK sends client credentials over the wire.
 *
 * OWASP A10:2021 — Server-Side Request Forgery (SSRF)
 */

/**
 * IPv4 ranges that must never be contacted by the token exchange.
 * Covers RFC 1918 private, link-local (cloud metadata), loopback, and
 * current-network addresses.
 */
const BLOCKED_IPV4_PATTERNS: RegExp[] = [
	/^127\./, // loopback
	/^10\./, // RFC 1918 Class A
	/^172\.(1[6-9]|2\d|3[01])\./, // RFC 1918 Class B
	/^192\.168\./, // RFC 1918 Class C
	/^169\.254\./, // link-local — AWS/Azure IMDS
	/^0\./, // current network
];

/**
 * Hostnames used by cloud providers for instance metadata endpoints.
 * A `tokenUrl` pointing here is always malicious.
 */
const BLOCKED_HOSTNAMES = new Set([
	'metadata.google.internal', // GCP
	'metadata.internal', // generic cloud metadata
	'localhost',
	'[::1]', // IPv6 loopback
]);

export class TokenUrlValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TokenUrlValidationError';
	}
}

/**
 * Validates a token endpoint URL before any credential material is sent.
 *
 * @param url - The raw `tokenUrl` string from the plugin's `oauthConfig`.
 * @returns The parsed `URL` object (guaranteed HTTPS, non-private).
 * @throws {TokenUrlValidationError} if the URL fails any check.
 */
export function validateTokenUrl(url: string): URL {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new TokenUrlValidationError(
			`Invalid tokenUrl: unable to parse "${url}"`,
		);
	}

	// ── Scheme: HTTPS only ──────────────────────────────────────────────
	if (parsed.protocol !== 'https:') {
		throw new TokenUrlValidationError(
			`tokenUrl must use HTTPS (got ${parsed.protocol}). ` +
				'Sending client credentials over plain HTTP exposes them to network interception.',
		);
	}

	// ── Blocked hostnames (cloud metadata, loopback) ────────────────────
	const hostname = parsed.hostname.toLowerCase();
	if (BLOCKED_HOSTNAMES.has(hostname)) {
		throw new TokenUrlValidationError(
			`tokenUrl hostname is blocked: "${hostname}". ` +
				'This address is reserved for cloud metadata or loopback.',
		);
	}

	// ── Blocked IPv4 ranges ─────────────────────────────────────────────
	for (const pattern of BLOCKED_IPV4_PATTERNS) {
		if (pattern.test(hostname)) {
			throw new TokenUrlValidationError(
				`tokenUrl points to a private/reserved IP range: "${hostname}". ` +
					'OAuth token endpoints must be publicly routable.',
			);
		}
	}

	// ── IPv6 private / link-local ───────────────────────────────────────
	if (hostname.startsWith('[') || /^fd[0-9a-f]{2}:/i.test(hostname)) {
		throw new TokenUrlValidationError(
			`tokenUrl points to a private IPv6 address: "${hostname}".`,
		);
	}

	return parsed;
}
