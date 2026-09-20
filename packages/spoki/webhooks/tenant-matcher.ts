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
 * Security:
 * - Matchers and the registered `spokiEvent` handler all call
 *   verifySpokiWebhookRequest. Presence of `x-spoki-signature` alone never
 *   authenticates a delivery.
 * - The HMAC covers only `<timestamp>.<raw body>`; `x-spoki-account` is
 *   outside that envelope. Tenant resolution therefore uses only an account
 *   id from the signed body. A body/header mismatch is rejected. Unsigned
 *   or invalid deliveries match no tenant.
 * - When adapters parse JSON before us, processWebhook may re-serialize the
 *   body. Verification expands common wire forms (compact / pretty / tabs /
 *   trailing newlines) and, when Content-Length is present, prefers
 *   candidates whose length matches the original — same approach as Stripe.
 *   Extra candidates cannot help an attacker: a match still requires the
 *   secret. Prefer passing the raw string body through for byte-exact checks.
 * - Without a configured webhook secret nothing routes.
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

function contentLengthOf(
	headers: Record<string, string | string[] | undefined>,
): number | null {
	const raw = getHeader(headers, 'content-length');
	if (!raw) return null;
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) && n >= 0 ? n : null;
}

function bodyCandidates(
	bases: Iterable<string>,
	contentLength: number | null,
): string[] {
	const candidates = new Set<string>();
	for (const base of bases) {
		candidates.add(base);
		candidates.add(`${base}\n`);
		candidates.add(`${base}\r\n`);
		try {
			const obj = JSON.parse(base);
			candidates.add(JSON.stringify(obj));
			candidates.add(JSON.stringify(obj, null, 2));
			candidates.add(JSON.stringify(obj, null, 4));
			candidates.add(JSON.stringify(obj, null, '\t'));
			for (const form of [
				JSON.stringify(obj),
				JSON.stringify(obj, null, 2),
				JSON.stringify(obj, null, 4),
				JSON.stringify(obj, null, '\t'),
			]) {
				candidates.add(`${form}\n`);
				candidates.add(`${form}\r\n`);
			}
		} catch {
			// Not valid JSON; keep only the raw candidates.
		}
	}

	if (contentLength === null) return [...candidates];

	const lengthMatched = [...candidates].filter(
		(c) => c.length === contentLength,
	);
	// Prefer length-matched forms when Content-Length reveals the original
	// wire size (Stripe pattern). Fall back to the full set if nothing fits —
	// some proxies strip or rewrite Content-Length.
	return lengthMatched.length > 0 ? lengthMatched : [...candidates];
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

	// Byte-exact rawBody first. Also seed from the parsed payload so a
	// processWebhook re-serialization still expands into the common wire
	// forms below.
	const bases = new Set<string>();
	if (request.rawBody) {
		bases.add(request.rawBody);
	}
	if (request.payload && typeof request.payload === 'object') {
		bases.add(JSON.stringify(request.payload));
	}

	const candidates = bodyCandidates(bases, contentLengthOf(headers));

	if (candidates.length === 0) {
		return {
			valid: false,
			error:
				'Missing raw body for signature verification (pass the raw string body)',
		};
	}

	for (const candidate of candidates) {
		if (verifySpokiWebhookSignature(candidate, signature, secret)) {
			return { valid: true };
		}
	}

	return { valid: false, error: 'Invalid signature' };
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

export function matchSpokiPluginWebhook(
	request: RawWebhookRequest,
	webhookSecret: string | undefined,
): boolean {
	if (!webhookSecret) return false;

	// Authenticate at match time — do not route on header presence alone.
	// Validity is also re-checked by the registered spokiEvent handler.
	const parsed = webhookRequestFromRaw(request);
	return verifySpokiWebhookRequest(parsed, webhookSecret).valid;
}

export function matchSpokiTenantWebhook(
	request: RawWebhookRequest,
	webhookSecret?: string,
): WebhookTenantMatch | null {
	if (!webhookSecret) return null;

	const parsed = webhookRequestFromRaw(request);
	if (!verifySpokiWebhookRequest(parsed, webhookSecret).valid) return null;

	// Tenant id must come from the signed body. x-spoki-account is not covered
	// by the HMAC, so it can only confirm agreement — never select the tenant.
	const bodyAccount = accountFromPayload(parsed.payload);
	if (!bodyAccount) return null;

	const headerAccount = getHeader(request.headers ?? {}, 'x-spoki-account');
	if (headerAccount && bodyAccount !== headerAccount) {
		return null;
	}

	return { linkType: 'account_id', externalId: bodyAccount };
}
