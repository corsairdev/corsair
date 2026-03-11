import { z } from 'zod';
import { verifyHmacSignatureWithPrefix } from '../../../async-core/webhook-utils';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

export const PagerdutyWebhookReferenceSchema = z.object({
	id: z.string(),
	type: z.string(),
	summary: z.string().optional(),
	html_url: z.string().nullable().optional(),
});
export type PagerdutyWebhookReference = z.infer<typeof PagerdutyWebhookReferenceSchema>;

export const PagerdutyWebhookIncidentDataSchema = z.object({
	id: z.string(),
	type: z.literal('incident'),
	incident_number: z.number().optional(),
	title: z.string().optional(),
	status: z.enum(['triggered', 'acknowledged', 'resolved']).optional(),
	urgency: z.enum(['high', 'low']).optional(),
	html_url: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	resolved_at: z.string().nullable().optional(),
	service: PagerdutyWebhookReferenceSchema.optional(),
	escalation_policy: PagerdutyWebhookReferenceSchema.optional(),
	teams: z.array(PagerdutyWebhookReferenceSchema).optional(),
	assignees: z.array(PagerdutyWebhookReferenceSchema).optional(),
});
export type PagerdutyWebhookIncidentData = z.infer<typeof PagerdutyWebhookIncidentDataSchema>;

export const PagerdutyWebhookAgentSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	summary: z.string().optional(),
	html_url: z.string().nullable().optional(),
});

export const PagerdutyWebhookClientSchema = z.object({
	name: z.string().optional(),
});

// ── Event Schemas ─────────────────────────────────────────────────────────────

const PagerdutyEventBaseSchema = z.object({
	id: z.string(),
	event_type: z.string(),
	resource_type: z.string(),
	occurred_at: z.string(),
	agent: PagerdutyWebhookAgentSchema.optional(),
	client: PagerdutyWebhookClientSchema.nullable().optional(),
});

export const IncidentTriggeredEventSchema = PagerdutyEventBaseSchema.extend({
	event_type: z.literal('incident.triggered'),
	resource_type: z.literal('incident'),
	data: PagerdutyWebhookIncidentDataSchema,
});
export type IncidentTriggeredEvent = z.infer<typeof IncidentTriggeredEventSchema>;

export const IncidentAcknowledgedEventSchema = PagerdutyEventBaseSchema.extend({
	event_type: z.literal('incident.acknowledged'),
	resource_type: z.literal('incident'),
	data: PagerdutyWebhookIncidentDataSchema,
});
export type IncidentAcknowledgedEvent = z.infer<typeof IncidentAcknowledgedEventSchema>;

export const IncidentResolvedEventSchema = PagerdutyEventBaseSchema.extend({
	event_type: z.literal('incident.resolved'),
	resource_type: z.literal('incident'),
	data: PagerdutyWebhookIncidentDataSchema,
});
export type IncidentResolvedEvent = z.infer<typeof IncidentResolvedEventSchema>;

export const IncidentAssignedEventSchema = PagerdutyEventBaseSchema.extend({
	event_type: z.literal('incident.assigned'),
	resource_type: z.literal('incident'),
	data: PagerdutyWebhookIncidentDataSchema,
});
export type IncidentAssignedEvent = z.infer<typeof IncidentAssignedEventSchema>;

// ── Payload Wrapper ───────────────────────────────────────────────────────────

export const PagerdutyWebhookMessageSchema = z.object({
	event: z.union([
		IncidentTriggeredEventSchema,
		IncidentAcknowledgedEventSchema,
		IncidentResolvedEventSchema,
		IncidentAssignedEventSchema,
		PagerdutyEventBaseSchema.extend({
			// fallback for unknown event types
			// event_type can be any string not covered by the above
			data: z.record(z.string(), z.unknown()),
		}),
	]),
});

export const PagerdutyWebhookPayloadSchema = z.object({
	messages: z.array(PagerdutyWebhookMessageSchema),
});

export type PagerdutyWebhookPayload = z.infer<typeof PagerdutyWebhookPayloadSchema>;

export type PagerdutyWebhookPayloadFor<TEvent> = {
	messages: Array<{ event: TEvent }>;
};

// ── Webhook Outputs ───────────────────────────────────────────────────────────

export type PagerdutyWebhookOutputs = {
	incidentTriggered: IncidentTriggeredEvent;
	incidentAcknowledged: IncidentAcknowledgedEvent;
	incidentResolved: IncidentResolvedEvent;
	incidentAssigned: IncidentAssignedEvent;
};

// ── Utilities ─────────────────────────────────────────────────────────────────

// Using 'unknown' for both parameter and return because the body can arrive as
// a raw JSON string or an already-parsed object, and we cannot assume a shape
// before inspecting whether it is a string. 
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createPagerdutyMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// body can be string or parsed object
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		const messages = parsedBody.messages;

		if (!Array.isArray(messages) || messages.length === 0) {
			return false;
		}

		// any message in the batch matching the event type triggers this handler
		return messages.some((message: unknown) => {
			// each message is an object with an event field
			const msg = message as Record<string, unknown>;
			const event = msg.event as Record<string, unknown> | undefined;
			return event?.event_type === eventType;
		});
	};
}

export function verifyPagerdutyWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return { valid: false, error: 'Missing raw body for signature verification' };
	}

	const headers = request.headers;
	const signatureHeader = Array.isArray(headers['x-pagerduty-signature'])
		? headers['x-pagerduty-signature'][0]
		: headers['x-pagerduty-signature'];

	if (!signatureHeader) {
		return { valid: false, error: 'Missing x-pagerduty-signature header' };
	}

	// PagerDuty sends multiple signatures separated by commas; check any one
	const signatures = signatureHeader.split(',').map((s: string) => s.trim());

	const isValid = signatures.some((sig: string) =>
		verifyHmacSignatureWithPrefix(rawBody, secret, sig, 'v1='),
	);

	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
