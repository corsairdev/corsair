import crypto from 'crypto';
import { z } from 'zod';
import type { CorsairWebhookMatcher, RawWebhookRequest } from '../../../core';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const ResourceSchema = z.object({
	gid: z.string(),
	resource_type: z.string().optional(),
	resource_subtype: z.string().optional(),
	name: z.string().optional(),
});

const UserSchema = z.object({
	gid: z.string(),
	resource_type: z.string().optional(),
	name: z.string().optional(),
});

// ── Asana Webhook Event Schema ────────────────────────────────────────────────
// Asana webhooks send an array of events in a single request body.
// Each event describes a change to a resource.

export const AsanaWebhookEventSchema = z.object({
	action: z.string(),
	created_at: z.string().optional(),
	resource: ResourceSchema.optional(),
	parent: ResourceSchema.nullable().optional(),
	user: UserSchema.nullable().optional(),
	change: z.object({
		field: z.string().optional(),
		action: z.string().optional(),
		new_value: z.unknown().optional(),
		added_value: z.unknown().optional(),
		removed_value: z.unknown().optional(),
	}).optional(),
});

export type AsanaWebhookEvent = z.infer<typeof AsanaWebhookEventSchema>;

// ── Task Event ────────────────────────────────────────────────────────────────

export const AsanaTaskEventSchema = AsanaWebhookEventSchema.extend({
	resource: ResourceSchema.extend({
		resource_type: z.literal('task'),
	}).optional(),
});

export type AsanaTaskEvent = z.infer<typeof AsanaTaskEventSchema>;

// ── Webhook Payload ───────────────────────────────────────────────────────────
// Full body of an Asana webhook request: contains an array of events.

export const AsanaWebhookPayloadSchema = z.object({
	events: z.array(AsanaWebhookEventSchema),
});

export type AsanaWebhookPayload = z.infer<typeof AsanaWebhookPayloadSchema>;

// ── Task-specific Payload ─────────────────────────────────────────────────────

export const AsanaTaskWebhookPayloadSchema = z.object({
	events: z.array(AsanaTaskEventSchema),
});

export type AsanaTaskWebhookPayload = z.infer<typeof AsanaTaskWebhookPayloadSchema>;

// ── Webhook Outputs ───────────────────────────────────────────────────────────

export type AsanaWebhookOutputs = {
	taskEvent: AsanaTaskWebhookPayload;
};

// ── Event Matcher ─────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createAsanaEventMatch(
	resourceType: string,
	action?: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// any/unknown for parsed body since raw webhook body is untyped
		const body = parseBody(request.body) as Record<string, unknown>;
		const events = body.events;
		if (!Array.isArray(events)) {
			return false;
		}
		return events.some((event: unknown) => {
			if (!event || typeof event !== 'object') return false;
			// any/unknown for event since it's parsed from raw JSON
			const e = event as Record<string, unknown>;
			const resource = e.resource as Record<string, unknown> | undefined;
			return (
				resource?.resource_type === resourceType &&
				(action === undefined || e.action === action)
			);
		});
	};
}

// ── Signature Verification ────────────────────────────────────────────────────
// Asana uses HMAC SHA256 to sign webhook payloads.
// The signature is sent in the X-Hook-Signature header.

export function verifyAsanaWebhookSignature(
	request: { rawBody: string; headers: Record<string, string> },
	secret: string,
): { valid: boolean; error?: string } {
	const signature = request.headers['x-hook-signature'];
	if (!signature) {
		return { valid: false, error: 'Missing x-hook-signature header' };
	}

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(request.rawBody)
		.digest('hex');

	let isValid: boolean;
	try {
		isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
	} catch {
		return { valid: false, error: 'Signature comparison failed' };
	}

	return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
}
