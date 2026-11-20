import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Penpot posts team-level events (file created or updated, comment added,
 * ...) to the endpoints registered through the webhooks RPC. The help
 * center documents no signature scheme for these deliveries, so the plugin
 * accepts them on the shape of the payload and the overview says so
 * plainly.
 * https://help.penpot.app/technical-guide/integration/#webhooks
 */

// unknown: the delivery body is untyped until the schema parses it; only
// the documented event keys are read here.
type DeliveryBody = Record<string, unknown>;

/**
 * Verifies the delivery on the documented envelope: an object with an event
 * name. Penpot documents no signature scheme, so nothing stronger is
 * available.
 */
export function verifyPenpotWebhook(
	// unknown: the payload stays unknown until the event schema parses it.
	request: WebhookRequest<unknown>,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	// unknown: the delivery body is untyped until the schema parses it; the
	// verifier only checks for the documented event key.
	// unknown: the delivery payload is untyped until the schema parses it;
	// the verifier only checks for the documented event key.
	const body =
		!request.payload || typeof request.payload !== 'object'
			? null
			: (request.payload as Record<string, unknown>);
	if (!body) {
		return { valid: false, error: 'Delivery body is not an object' };
	}
	const eventType =
		typeof body['penpot.event'] === 'string'
			? body['penpot.event']
			: typeof body.event === 'string'
				? body.event
				: undefined;
	if (!eventType) {
		return {
			valid: false,
			error: 'Delivery carries no documented event key (penpot.event or event)',
		};
	}
	return { valid: true };
}

// ── Payload ────────────────────────────────────────────────────────────────

export const PenpotEventSchema = z
	.object({
		/** The event that fired, e.g. "penpot.file.updated". */
		event: z.string().min(1),
		// unknown: the payload object's keys depend on the event type, so it
		// stays an open record.
		payload: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export const PenpotWebhookPayloadSchema = PenpotEventSchema.describe(
	'One Penpot webhook delivery',
);

export type PenpotWebhookPayload = z.infer<typeof PenpotEventSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Penpot sends every team event to the one endpoint of a webhook, so
 * matching only needs the documented envelope. A body parsed by
 * processWebhook is an object here (readBodyRecord returns null otherwise).
 */
export function matchPenpotWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return body !== null && typeof body.event === 'string';
}
