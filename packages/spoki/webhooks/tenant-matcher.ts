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
 * - When body arrives as a raw string or Buffer the matchers extract the exact
 *   bytes directly and set rawBody before calling verifySpokiWebhookRequest.
 *   Non-standard JSON whitespace (e.g. `{"k" : "v"}`) is preserved exactly.
 *   Callers must forward the raw string body for byte-exact verification.
 * - When an adapter pre-parses the body to an object (rawBody unavailable),
 *   verifySpokiWebhookRequest falls back to bodyCandidates which generates
 *   compact, 2-space, 4-space, single-space, and tab-indented forms. An
 *   attacker cannot exploit extra candidates; each candidate must still pass
 *   the HMAC before a delivery is accepted.
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
			// When the base is a raw string, the JSON.parse round-trip only adds
			// standard serialization forms (compact, indented). Non-standard
			// whitespace within the original bytes is preserved by the `base`
			// candidate above when body arrived as a raw string.
			const obj = JSON.parse(base);
			for (const form of [
				JSON.stringify(obj),
				JSON.stringify(obj, null, 1),
				JSON.stringify(obj, null, 2),
				JSON.stringify(obj, null, 4),
				JSON.stringify(obj, null, '\t'),
			]) {
				candidates.add(form);
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

/**
 * Converts a raw webhook request into the typed WebhookRequest shape used by
 * verifySpokiWebhookRequest. The raw bytes are preserved byte-for-byte in
 * `rawBody` whenever the body arrived as a string or Buffer, so
 * verifySpokiWebhookRequest performs a byte-exact HMAC check before falling
 * back to the serialization-candidate expansion. When the body is an already-
 * parsed object (e.g. parsed by an upstream Corsair adapter), `rawBody` is
 * absent and only reconstructed serialization forms are checked.
 */
function webhookRequestFromRaw(
	request: RawWebhookRequest,
): WebhookRequest<unknown> {
	const body = request.body;
	if (typeof body === 'string') {
		// Preserve the exact wire bytes — non-standard JSON whitespace is kept.
		let payload: unknown = body;
		try {
			payload = JSON.parse(body);
		} catch {
			// Non-JSON string; keep as-is for rawBody.
		}
		return { payload, headers: request.headers, rawBody: body };
	}
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
		const rawBody = body.toString('utf8');
		let payload: unknown = rawBody;
		try {
			payload = JSON.parse(rawBody);
		} catch {
			// Non-JSON buffer; keep the decoded string.
		}
		return { payload, headers: request.headers, rawBody };
	}
	// Body is a pre-parsed object — raw bytes are unrecoverable. Signature
	// verification falls back to bodyCandidates' serialization forms.
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

/**
 * Extracts the raw body string from a RawWebhookRequest when the body is a
 * string or Buffer, preserving the exact wire bytes. Returns undefined when the
 * body is already a parsed object (rawBody is unrecoverable in that case).
 */
function extractRawBody(request: RawWebhookRequest): string | undefined {
	const { body } = request;
	if (typeof body === 'string') return body;
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
		return body.toString('utf8');
	}
	return undefined;
}

export function matchSpokiPluginWebhook(
	request: RawWebhookRequest,
	webhookSecret: string | undefined,
): boolean {
	if (!webhookSecret) return false;

	// Authenticate at match time — do not route on header presence alone.
	// Validity is also re-checked by the registered spokiEvent handler.
	//
	// extractRawBody returns the exact wire bytes when body is a string/Buffer,
	// so non-standard JSON whitespace is preserved for byte-exact HMAC checks.
	// When body is a pre-parsed object the rawBody is absent and
	// verifySpokiWebhookRequest falls back to serialization candidates.
	const rawBody = extractRawBody(request);
	const parsed = webhookRequestFromRaw(request);
	if (rawBody !== undefined) {
		parsed.rawBody = rawBody;
	}
	return verifySpokiWebhookRequest(parsed, webhookSecret).valid;
}

export function matchSpokiTenantWebhook(
	request: RawWebhookRequest,
	webhookSecret?: string,
): WebhookTenantMatch | null {
	if (!webhookSecret) return null;

	// Extract raw bytes directly when body is a string/Buffer so non-standard
	// JSON whitespace is preserved for byte-exact HMAC verification.
	const rawBody = extractRawBody(request);
	const parsed = webhookRequestFromRaw(request);
	if (rawBody !== undefined) {
		parsed.rawBody = rawBody;
	}
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
