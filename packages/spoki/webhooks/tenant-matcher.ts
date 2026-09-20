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
 * Architecture:
 * - Matchers route incoming deliveries to the Spoki plugin and resolve the
 *   tenant based on x-spoki-account header and body account id. Matchers
 *   do not perform HMAC verification because the wire bytes may already be
 *   parsed and multi-tenant credentials are resolved per-tenant.
 * - Authenticity is enforced by the registered `spokiEvent` webhook handler,
 *   which receives the request with the original `rawBody` and verifies the
 *   HMAC-SHA256 signature using verifySpokiWebhookRequest with the tenant's secret.
 *   Forged or invalid deliveries receive a 401 response.
 */

const SIGNATURE_TOLERANCE_SECONDS = 300;

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

	const rawBody =
		request.rawBody ??
		(typeof request.payload === 'string'
			? request.payload
			: request.payload
				? JSON.stringify(request.payload)
				: '');

	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	if (verifySpokiWebhookSignature(rawBody, signature, secret)) {
		return { valid: true };
	}

	return { valid: false, error: 'Invalid signature' };
}

function readBodyRecord(
	request: RawWebhookRequest,
): Record<string, unknown> | null {
	const body = request.body;
	if (!body) return null;
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
		try {
			const parsed = JSON.parse(body.toString('utf8'));
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				return parsed as Record<string, unknown>;
			}
		} catch {
			return null;
		}
	}
	if (typeof body === 'object' && !Array.isArray(body)) {
		return body as Record<string, unknown>;
	}
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				return parsed as Record<string, unknown>;
			}
		} catch {
			return null;
		}
	}
	return null;
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
	_webhookSecret?: string,
): boolean {
	const headers = request.headers ?? {};
	return (
		getHeader(headers, 'x-spoki-signature') !== undefined ||
		getHeader(headers, 'x-spoki-account') !== undefined
	);
}

export function matchSpokiTenantWebhook(
	request: RawWebhookRequest,
	_webhookSecret?: string,
): WebhookTenantMatch | null {
	const headers = request.headers ?? {};
	const headerAccount = getHeader(headers, 'x-spoki-account');
	const body = readBodyRecord(request);
	const bodyAccount = body ? accountFromPayload(body) : undefined;
	if (bodyAccount && headerAccount && bodyAccount !== headerAccount) {
		return null;
	}
	const account = bodyAccount ?? headerAccount;
	if (!account) return null;

	return { linkType: 'account_id', externalId: account };
}
