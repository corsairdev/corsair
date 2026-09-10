import type {
	RawWebhookRequest,
	WebhookRequest,
	WebhookTenantMatch,
} from 'corsair/core';
import crypto from 'crypto';

/*
 * Spoki webhook contract (Spoki API Postman collection, "Signature
 * Verification"): every delivery carries `X-SPOKI-ACCOUNT` (account id) plus
 * the V2 `X-Spoki-Signature: t=<ts>,v2=<hex>` header (HMAC-SHA256 of
 * `<ts>.<raw body>` keyed by the webhook secret). The deprecated V1
 * `X-SPOKI-HASH` header cannot be verified and never matches on its own.
 *
 * Security split (matchers route, the handler enforces):
 * - The HMAC covers only `<timestamp>.<raw body>`; the `x-spoki-account`
 *   header travels outside the signed envelope, so no tenant identity read
 *   from it can be authenticated — replaying a valid delivery with a swapped
 *   account header would otherwise select an arbitrary tenant. The tenant
 *   matcher therefore claims nothing and always returns null (same as the
 *   fireflies/amplitude plugins); tenant attribution comes from the
 *   connection that configured the webhook, not from delivery headers.
 * - The plugin matcher only routes ("looks like Spoki, and a secret is
 *   configured to verify it with"). It makes no authenticity claim, so it
 *   works with the parsed bodies the standard webhook flow hands to
 *   matchers. Authenticity and freshness are enforced in the registered
 *   `spokiEvent` handler via verifySpokiWebhookRequest over request.rawBody
 *   (byte-exact when callers pass the raw string body); anything else gets
 *   a 401. Without a configured webhook secret nothing routes.
 */

const SIGNATURE_TOLERANCE_SECONDS = 300;

// Header map values are string | string[] | undefined depending on the HTTP
// adapter, and adapter casing is not guaranteed.
function getHeader(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

export function verifySpokiWebhookSignature(
	rawBody: string,
	header: string,
	secret: string,
	toleranceSeconds: number = SIGNATURE_TOLERANCE_SECONDS,
): boolean {
	const parts: Record<string, string> = {};

	for (const part of header.split(',')) {
		const [key, value] = part.split('=', 2);
		if (key && value) parts[key.trim()] = value.trim();
	}

	const timestamp = parts.t;
	const signature = parts.v2;

	if (!timestamp || !signature) return false;

	const requestTime = Number.parseInt(timestamp, 10);

	if (Number.isNaN(requestTime)) return false;

	if (Math.abs(Date.now() / 1000 - requestTime) > toleranceSeconds) {
		return false;
	}

	const signedPayload = `${timestamp}.${rawBody}`;
	const expected = crypto
		.createHmac('sha256', secret)
		.update(signedPayload)
		.digest('hex');

	try {
		if (
			!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
		) {
			return false;
		}
	} catch {
		return false;
	}

	return true;
}

export function verifySpokiWebhookRequest(
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) {
		return { valid: true };
	}

	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers ?? {};
	const signature = getHeader(headers, 'x-spoki-signature');
	if (!signature) {
		return { valid: false, error: 'Missing x-spoki-signature header' };
	}

	const ok = verifySpokiWebhookSignature(rawBody, signature, secret);
	if (!ok) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

export function matchSpokiPluginWebhook(
	request: RawWebhookRequest,
	webhookSecret: string | undefined,
): boolean {
	if (!webhookSecret) return false;

	// Routing only: the signature header marks this as a Spoki delivery.
	// Validity is enforced later by the webhook handler over the raw body.
	return getHeader(request.headers ?? {}, 'x-spoki-signature') !== undefined;
}

export function matchSpokiTenantWebhook(
	_request: RawWebhookRequest,
	_webhookSecret?: string,
): WebhookTenantMatch | null {
	// The account header is outside Spoki's signature envelope, so no tenant
	// read from a delivery can be authenticated. Claim nothing here; the
	// handler verifies authenticity and the connection provides the tenant.
	return null;
}
