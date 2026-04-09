import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Base payload schema
// ─────────────────────────────────────────────────────────────────────────────

export const ResendWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string().optional(),
			domain_id: z.string().optional(),
			from: z.string().optional(),
			to: z.array(z.string()).optional(),
			subject: z.string().optional(),
			created_at: z.string(),
			name: z.string().optional(),
			status: z.string().optional(),
			bounce_type: z.string().optional(),
			link: z.string().optional(),
			error: z.string().optional(),
		})
		.catchall(z.unknown()),
});
export type ResendWebhookPayload = z.infer<typeof ResendWebhookPayloadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Email event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const EmailBouncedEventSchema = z.object({
	type: z.literal('email.bounced'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
			bounce_type: z.string().optional(),
		})
		.catchall(z.unknown()),
});
export type EmailBouncedEvent = z.infer<typeof EmailBouncedEventSchema>;

export const EmailClickedEventSchema = z.object({
	type: z.literal('email.clicked'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
			link: z.string().optional(),
		})
		.catchall(z.unknown()),
});
export type EmailClickedEvent = z.infer<typeof EmailClickedEventSchema>;

export const EmailComplainedEventSchema = z.object({
	type: z.literal('email.complained'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
		})
		.catchall(z.unknown()),
});
export type EmailComplainedEvent = z.infer<typeof EmailComplainedEventSchema>;

export const EmailDeliveredEventSchema = z.object({
	type: z.literal('email.delivered'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
		})
		.catchall(z.unknown()),
});
export type EmailDeliveredEvent = z.infer<typeof EmailDeliveredEventSchema>;

export const EmailFailedEventSchema = z.object({
	type: z.literal('email.failed'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
			error: z.string().optional(),
		})
		.catchall(z.unknown()),
});
export type EmailFailedEvent = z.infer<typeof EmailFailedEventSchema>;

export const EmailOpenedEventSchema = z.object({
	type: z.literal('email.opened'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
		})
		.catchall(z.unknown()),
});
export type EmailOpenedEvent = z.infer<typeof EmailOpenedEventSchema>;

export const EmailReceivedEventSchema = z.object({
	type: z.literal('email.received'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
		})
		.catchall(z.unknown()),
});
export type EmailReceivedEvent = z.infer<typeof EmailReceivedEventSchema>;

export const EmailSentEventSchema = z.object({
	type: z.literal('email.sent'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
		})
		.catchall(z.unknown()),
});
export type EmailSentEvent = z.infer<typeof EmailSentEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Domain event schemas
// ─────────────────────────────────────────────────────────────────────────────

const DomainStatusSchema = z.enum([
	'not_started',
	'validation',
	'scheduled',
	'ready',
	'error',
]);

export const DomainCreatedEventSchema = z.object({
	type: z.literal('domain.created'),
	created_at: z.string(),
	data: z
		.object({
			domain_id: z.string(),
			name: z.string(),
			status: DomainStatusSchema,
			created_at: z.string(),
		})
		.catchall(z.unknown()),
});
export type DomainCreatedEvent = z.infer<typeof DomainCreatedEventSchema>;

export const DomainUpdatedEventSchema = z.object({
	type: z.literal('domain.updated'),
	created_at: z.string(),
	data: z
		.object({
			domain_id: z.string(),
			name: z.string(),
			status: DomainStatusSchema,
			created_at: z.string(),
		})
		.catchall(z.unknown()),
});
export type DomainUpdatedEvent = z.infer<typeof DomainUpdatedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Union and map types
// ─────────────────────────────────────────────────────────────────────────────

export const ResendWebhookEventSchema = z.union([
	EmailBouncedEventSchema,
	EmailClickedEventSchema,
	EmailComplainedEventSchema,
	EmailDeliveredEventSchema,
	EmailFailedEventSchema,
	EmailOpenedEventSchema,
	EmailReceivedEventSchema,
	EmailSentEventSchema,
	DomainCreatedEventSchema,
	DomainUpdatedEventSchema,
]);
export type ResendWebhookEvent = z.infer<typeof ResendWebhookEventSchema>;

export type ResendEventName =
	| 'email.bounced'
	| 'email.clicked'
	| 'email.complained'
	| 'email.delivered'
	| 'email.failed'
	| 'email.opened'
	| 'email.received'
	| 'email.sent'
	| 'domain.created'
	| 'domain.updated';

export interface ResendEventMap {
	'email.bounced': EmailBouncedEvent;
	'email.clicked': EmailClickedEvent;
	'email.complained': EmailComplainedEvent;
	'email.delivered': EmailDeliveredEvent;
	'email.failed': EmailFailedEvent;
	'email.opened': EmailOpenedEvent;
	'email.received': EmailReceivedEvent;
	'email.sent': EmailSentEvent;
	'domain.created': DomainCreatedEvent;
	'domain.updated': DomainUpdatedEvent;
}

export type ResendWebhookOutputs = {
	emailBounced: EmailBouncedEvent;
	emailClicked: EmailClickedEvent;
	emailComplained: EmailComplainedEvent;
	emailDelivered: EmailDeliveredEvent;
	emailFailed: EmailFailedEvent;
	emailOpened: EmailOpenedEvent;
	emailReceived: EmailReceivedEvent;
	emailSent: EmailSentEvent;
	domainCreated: DomainCreatedEvent;
	domainUpdated: DomainUpdatedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifyResendWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['svix-signature'])
		? headers['svix-signature'][0]
		: headers['svix-signature'] ||
			(Array.isArray(headers['x-resend-signature'])
				? headers['x-resend-signature'][0]
				: headers['x-resend-signature']);

	if (!signature) {
		return {
			valid: false,
			error: 'Missing svix-signature or x-resend-signature header',
		};
	}

	const isValid = verifyHmacSignatureWithPrefix(
		rawBody,
		webhookSecret,
		signature,
		'sha256=',
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

export function createResendEventMatch(type: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return typeof parsedBody.type === 'string' && parsedBody.type === type;
	};
}

export const createResendMatch = createResendEventMatch;
