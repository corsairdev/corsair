import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import crypto from 'crypto';

/*
 * Spoki webhook contract (Spoki API Postman collection, "Signature
 * Verification"): every delivery carries `X-SPOKI-ACCOUNT` (account id) plus
 * either the V2 `X-Spoki-Signature: t=<ts>,v2=<hex>` header (HMAC-SHA256 of
 * `<ts>.<raw body>` keyed by the webhook secret) or the deprecated V1
 * `X-SPOKI-HASH` header (PBKDF2-HMAC-SHA256).
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

	const requestTime = Number.parseInt(timestamp, 10);

	if (Number.isNaN(requestTime)) return false;

	return Math.abs(Date.now() / 1000 - requestTime) <= toleranceSeconds;
}

export function matchSpokiPluginWebhook(request: RawWebhookRequest): boolean {
	const headers = request.headers ?? {};

	return (
		getHeader(headers, 'x-spoki-signature') !== undefined ||
		getHeader(headers, 'x-spoki-hash') !== undefined
	);
}

// Raw-body adapters hand over either a string or binary (Buffer/Uint8Array);
// pre-parsed objects cannot be signature-verified byte-exactly.
function readRawBody(body: unknown): string | undefined {
	if (typeof body === 'string') return body;
	if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
		return Buffer.from(body).toString('utf8');
	}
	return undefined;
}

export function matchSpokiTenantWebhook(
	request: RawWebhookRequest,
	webhookSecret?: string,
): WebhookTenantMatch | null {
	const headers = request.headers ?? {};

	const tenantId = getHeader(headers, 'x-spoki-account');

	if (!tenantId) return null;

	if (webhookSecret) {
		const signature = getHeader(headers, 'x-spoki-signature');
		const rawBody = readRawBody(request.body);

		if (!signature || !rawBody) return null;
		if (!verifySpokiWebhookSignature(rawBody, signature, webhookSecret)) {
			return null;
		}
	}

	return {
		linkType: 'spoki_account',
		externalId: tenantId,
	};
}
