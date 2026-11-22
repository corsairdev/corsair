import { createHmac, createVerify, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Passcreator delivers pass events (pass_created, pass_updated, pass_voided,
 * pushnotification_registered, ...) to endpoints subscribed with
 * signPayload: true. A delivery is the flat pass object (identifier, passId,
 * uniqueIdentifier, template fields) plus `signedData` (the JSON string that
 * was signed) and `signature` (hex ECDSA over signedData), verifiable with
 * the PEM public key from GET /api/hook/publickey. The body carries no event
 * name: the event is the one the subscription was created for.
 * https://developer.passcreator.com/en/webhooks/overview
 * https://developer.passcreator.com/en/signatures/verify-a-signature
 */

// unknown: the delivery payload is untyped until the schema parses it; only
// the two verification fields and the pass anchors are read here.
type DeliveryBody = Record<string, unknown>;

/** Extracts one header value regardless of the adapter's value shape. */
export function headerValue(
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

/**
 * Verifies the hex ECDSA signature over `signedData` with the PEM public
 * key. The docs verify with openssl_verify and SHA1 (its default); SHA256 is
 * also tried so a later switch on Passcreator's side keeps working.
 * The payload of a Passcreator delivery carries both fields; a delivery
 * without them cannot be verified.
 */
export function verifyPasscreatorSignature(
	// unknown: the delivery payload is untyped until the schema parses it;
	// verification reads only the signature and signedData fields.
	payload: unknown,
	publicKeyPem: string | undefined,
): { valid: boolean; error?: string } {
	const body = payload as DeliveryBody | null;
	if (!body) return { valid: false, error: 'Delivery body is not an object' };
	const signature =
		typeof body.signature === 'string' ? body.signature : undefined;
	const signedData =
		typeof body.signedData === 'string' ? body.signedData : undefined;
	if (!signature || !signedData) {
		return {
			valid: false,
			error:
				'Delivery carries no signature/signedData pair; subscribe with pull_mode disabled',
		};
	}
	if (!publicKeyPem) {
		return {
			valid: false,
			error:
				'No Passcreator public key available; fetch it once with webhooks.getPublicKey and store it with keys.set_webhook_signature',
		};
	}
	try {
		for (const algorithm of ['SHA1', 'SHA256']) {
			const verifier = createVerify(algorithm);
			verifier.update(signedData);
			verifier.end();
			if (verifier.verify(publicKeyPem, signature, 'hex')) {
				return { valid: true };
			}
		}
		return { valid: false, error: 'Invalid webhook signature' };
	} catch (error) {
		return {
			valid: false,
			error: `Signature verification failed: ${(error as Error).message}`,
		};
	}
}

// ── Per-account delivery token ─────────────────────────────────────────────
// Passcreator signs every customer's deliveries with one platform key, so a
// valid signature proves a delivery came from Passcreator, not which account
// it belongs to: a genuine delivery from one account would also verify at
// another tenant's webhook URL. Each subscription therefore carries a token
// in its target URL, derived from the account's own API key, and the handler
// accepts only deliveries whose URL carries this account's token.

/** Query parameter that carries the per-account delivery token. */
export const PASSCREATOR_WEBHOOK_TOKEN_PARAM = 'corsair_token';

/**
 * The account's delivery token: HMAC-SHA256 of a fixed label keyed by the
 * account's API key. It is stable while the key is, reveals nothing about the
 * key, and differs for every account. Rotating the API key changes it, so
 * subscriptions must be created again after a rotation.
 */
export function passcreatorWebhookToken(apiKey: string): string {
	return createHmac('sha256', apiKey)
		.update('corsair-passcreator-webhook-v1')
		.digest('hex')
		.slice(0, 40);
}

/** Adds (or replaces) the account's token on a subscription target URL. */
export function withPasscreatorWebhookToken(
	targetUrl: string,
	apiKey: string,
): string {
	const url = new URL(targetUrl);
	url.searchParams.set(
		PASSCREATOR_WEBHOOK_TOKEN_PARAM,
		passcreatorWebhookToken(apiKey),
	);
	return url.toString();
}

/** Checks the delivery URL's token against the account's token. */
export function verifyPasscreatorWebhookToken(
	query: Record<string, string | string[] | undefined> | undefined,
	apiKey: string | undefined,
): { valid: boolean; error?: string } {
	if (!apiKey) {
		return {
			valid: false,
			error:
				'No Passcreator API key for this account; cannot check the delivery token',
		};
	}
	const raw = query?.[PASSCREATOR_WEBHOOK_TOKEN_PARAM];
	const presented = Array.isArray(raw) ? raw[0] : raw;
	if (!presented) {
		return {
			valid: false,
			error: `Delivery URL has no ${PASSCREATOR_WEBHOOK_TOKEN_PARAM}; create the subscription with webhooks.subscribe, which adds it`,
		};
	}
	const expected = Buffer.from(passcreatorWebhookToken(apiKey));
	const given = Buffer.from(presented);
	if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
		return {
			valid: false,
			error: 'Delivery token does not belong to this account',
		};
	}
	return { valid: true };
}

// ── Payload ────────────────────────────────────────────────────────────────

export const PasscreatorEventSchema = z
	.object({
		signature: z
			.string()
			.min(1)
			.describe('Hex ECDSA signature over signedData'),
		signedData: z
			.string()
			.min(1)
			.describe('The JSON string Passcreator signed: the pass data'),
		identifier: z.string().nullish().describe('Pass UUID'),
		uniqueIdentifier: z
			.string()
			.nullish()
			.describe('Unique pass identifier shown in the barcode'),
	})
	.loose()
	.describe('A signed Passcreator delivery: the flat pass object');

export const PasscreatorWebhookPayloadSchema = PasscreatorEventSchema.describe(
	'One Passcreator webhook delivery',
);

/** The verified pass data, parsed from signedData. */
export const PasscreatorSignedDataSchema = z
	.object({
		identifier: z.string().nullish().describe('Pass UUID'),
		passId: z.string().nullish().describe('Deprecated pass UUID'),
		uniqueIdentifier: z
			.string()
			.nullish()
			.describe('Unique pass identifier shown in the barcode'),
		passTemplateGuid: z.string().nullish().describe('Template UUID'),
	})
	.loose()
	.describe('The authenticated pass data of a delivery');

export type PasscreatorWebhookPayload = z.infer<typeof PasscreatorEventSchema>;
export type PasscreatorSignedData = z.infer<typeof PasscreatorSignedDataSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * A Passcreator delivery is recognised by its signature pair: the body has
 * no event field, and other providers post `{ event }` bodies (Stannp). A
 * body parsed by processWebhook is an object here (readBodyRecord returns
 * null otherwise).
 */
export function matchPasscreatorWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return (
		body !== null &&
		typeof body.signature === 'string' &&
		typeof body.signedData === 'string'
	);
}
