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
 * - The HMAC covers only `<timestamp>.<raw body>`; `x-spoki-account` is
 *   outside that envelope. The tenant matcher therefore verifies the
 *   signature first (byte-exact rawBody, then compact / trailing LF/CRLF /
 *   2-space pretty fallbacks), prefers an account id from the signed body,
 *   and only then falls back to `x-spoki-account`. A body/header mismatch
 *   is rejected. Unsigned or invalid deliveries match no tenant.
 * - The plugin matcher only routes ("looks like Spoki, and a secret is
 *   configured to verify it with"). It makes no authenticity claim, so it
 *   works with the parsed bodies the standard webhook flow hands to
 *   matchers. Authenticity and freshness are enforced in the registered
 *   `spokiEvent` handler via verifySpokiWebhookRequest. Without a configured
 *   webhook secret nothing routes.
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

	const headers = request.headers ?? {};
	const signature = getHeader(headers, 'x-spoki-signature');
	if (!signature) {
		return { valid: false, error: 'Missing x-spoki-signature header' };
	}

	// Byte-exact rawBody first. When a runtime parsed the JSON before us
	// (processWebhook re-serializes it), fall back through the common
	// serializations — compact, trailing LF/CRLF, 2-space pretty — same
	// approach as the typeform plugin. Trying extra candidates cannot help
	// an attacker: a match still requires the secret. For fully byte-exact
	// verification, callers should pass the raw string body through to
	// processWebhook.
	const bases = new Set<string>();
	if (request.rawBody) {
		bases.add(request.rawBody);
	} else if (request.payload && typeof request.payload === 'object') {
		bases.add(JSON.stringify(request.payload));
	}
	const candidates = new Set<string>();
	for (const base of bases) {
		candidates.add(base);
		candidates.add(`${base}\n`);
		candidates.add(`${base}\r\n`);
		try {
			candidates.add(JSON.stringify(JSON.parse(base), null, 2));
		} catch {
			// Not valid JSON; keep only the raw candidates.
		}
	}

	if (candidates.size === 0) {
		return {
			valid: false,
			error:
				'Missing raw body for signature verification (pass the raw string body)',
		};
	}

	let ok = false;
	for (const candidate of candidates) {
		if (verifySpokiWebhookSignature(candidate, signature, secret)) {
			ok = true;
			break;
		}
	}
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

function webhookRequestFromRaw(
	request: RawWebhookRequest,
): WebhookRequest<unknown> {
	const body = request.body;
	if (typeof body === 'string') {
		let payload: unknown = body;
		try {
			payload = JSON.parse(body);
		} catch {
			// keep the raw string
		}
		return { payload, headers: request.headers, rawBody: body };
	}
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
		const rawBody = body.toString('utf8');
		let payload: unknown = rawBody;
		try {
			payload = JSON.parse(rawBody);
		} catch {
			// keep the raw string
		}
		return { payload, headers: request.headers, rawBody };
	}
	return { payload: body, headers: request.headers };
}

function accountFromPayload(payload: unknown): string | undefined {
	if (!payload || typeof payload !== 'object') return undefined;
	const rec = payload as Record<string, unknown>;
	const data =
		rec.data && typeof rec.data === 'object'
			? (rec.data as Record<string, unknown>)
			: undefined;
	const value =
		rec.account_id ?? rec.account ?? data?.account_id ?? data?.account;
	if (typeof value === 'string' && value.length > 0) return value;
	if (typeof value === 'number') return String(value);
	return undefined;
}

export function matchSpokiTenantWebhook(
	request: RawWebhookRequest,
	webhookSecret?: string,
): WebhookTenantMatch | null {
	if (!webhookSecret) return null;

	const parsed = webhookRequestFromRaw(request);
	if (!verifySpokiWebhookRequest(parsed, webhookSecret).valid) return null;

	const headerAccount = getHeader(request.headers ?? {}, 'x-spoki-account');
	const bodyAccount = accountFromPayload(parsed.payload);
	if (bodyAccount && headerAccount && bodyAccount !== headerAccount) {
		return null;
	}
	const account = bodyAccount ?? headerAccount;
	if (!account) return null;

	return { linkType: 'account_id', externalId: account };
}
