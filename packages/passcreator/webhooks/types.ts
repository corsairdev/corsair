import { createVerify } from 'node:crypto';
import type { RawWebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Passcreator delivers pass events (pass_created, pass_updated, pass_deleted,
 * pass_scanned, ...) to endpoints subscribed through the API. Every payload
 * carries `signedData` (the canonical JSON of the pass) and `signature`
 * (hex-encoded SHA256 ECDSA over signedData), verifiable with the PEM EC
 * P-256 public key from GET /api/hook/publickey.
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
 * key, as the docs prescribe (openssl-style SHA256 with the EC P-256 key).
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
		const verifier = createVerify('SHA256');
		verifier.update(signedData);
		verifier.end();
		return { valid: verifier.verify(publicKeyPem, signature, 'hex') };
	} catch (error) {
		return {
			valid: false,
			error: `Signature verification failed: ${(error as Error).message}`,
		};
	}
}

// ── Payload ────────────────────────────────────────────────────────────────

export const PasscreatorEventSchema = z
	.object({
		/** The event that fired, e.g. "pass_created". */
		event: z.string().min(1),
		// unknown: the pass object's keys depend on the template's properties
		// (names or IDs), so it stays an open record.
		pass: z.record(z.string(), z.unknown()).nullish(),
		signature: z
			.string()
			.nullish()
			.describe('Hex SHA256 ECDSA signature over signedData'),
		signedData: z
			.string()
			.nullish()
			.describe('Canonical JSON of the signed pass data'),
	})
	.loose();

export const PasscreatorWebhookPayloadSchema = PasscreatorEventSchema.describe(
	'One Passcreator webhook delivery',
);

export type PasscreatorWebhookPayload = z.infer<typeof PasscreatorEventSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Passcreator sends every event type to the one endpoint of a subscription,
 * so matching only needs the documented envelope. A body parsed by
 * processWebhook is an object here (readBodyRecord returns null otherwise).
 */
export function matchPasscreatorWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return body !== null && typeof body.event === 'string';
}
