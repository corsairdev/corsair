import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

/**
 * Penpot posts the audit event itself to each webhook of the team, project
 * or file it happened in: `{ id, name, type, props, profileId, ... }` with
 * camelCase keys and `User-Agent: penpot/<version>`, and no signature
 * (penpot/penpot backend/src/app/loggers/webhooks.clj, checked 2026-11-21).
 * The plugin accepts deliveries on that shape and the overview says so.
 */

// unknown: a header value as core hands it over (string, list or absent).
function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
	const value = key === undefined ? undefined : headers[key];
	return Array.isArray(value) ? value[0] : value;
}

/** Penpot's own envelope: an event name, its props and the acting profile. */
// unknown: a parsed delivery body, narrowed key by key here.
function isPenpotEnvelope(body: Record<string, unknown>): boolean {
	return (
		typeof body.name === 'string' &&
		body.name.length > 0 &&
		body.props !== null &&
		typeof body.props === 'object' &&
		!Array.isArray(body.props) &&
		typeof body.profileId === 'string'
	);
}

/**
 * Verifies the delivery on Penpot's envelope. Penpot signs nothing, so
 * nothing stronger is available.
 */
export function verifyPenpotWebhook(
	// unknown: the payload stays unknown until the event schema parses it.
	request: WebhookRequest<unknown>,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	const body =
		!request.payload ||
		typeof request.payload !== 'object' ||
		Array.isArray(request.payload)
			? null
			: (request.payload as Record<string, unknown>);
	if (!body) {
		return { valid: false, error: 'Delivery body is not an object' };
	}
	if (!isPenpotEnvelope(body)) {
		return {
			valid: false,
			error: 'Delivery is not a Penpot event (name, props and profileId)',
		};
	}
	return { valid: true };
}

// ── Payload ────────────────────────────────────────────────────────────────

export const PenpotEventSchema = z
	.object({
		/** The audited action, e.g. "rename-file" or "create-comment". */
		name: z.string().min(1).describe('The action that happened'),
		id: z.string().nullish().describe('Audit event id'),
		type: z.string().nullish().describe('Event type, e.g. action'),
		profileId: z.string().describe('Profile that performed the action'),
		// unknown: the props keys depend on the action (file, project, team
		// and comment ids and names), so they stay an open record.
		props: z.record(z.string(), z.unknown()).describe('Details of the action'),
	})
	.loose();

export const PenpotWebhookPayloadSchema = PenpotEventSchema.describe(
	'One Penpot webhook delivery',
);

export type PenpotWebhookPayload = z.infer<typeof PenpotEventSchema>;

// ── Matching ───────────────────────────────────────────────────────────────

/**
 * Matches Penpot's envelope, and its User-Agent when the route keeps the
 * headers. A bare `event` key is not enough: other providers (Stannp) send
 * one too on the shared webhook route.
 */
export function matchPenpotWebhook(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	if (body === null || !isPenpotEnvelope(body)) return false;
	const agent = headerValue(request.headers ?? {}, 'user-agent');
	return agent === undefined || agent.toLowerCase().startsWith('penpot/');
}
