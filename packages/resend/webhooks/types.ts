import { createHmac } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
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

export const EmailScheduledEventSchema = z.object({
	type: z.literal('email.scheduled'),
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
export type EmailScheduledEvent = z.infer<typeof EmailScheduledEventSchema>;

export const EmailSuppressedEventSchema = z.object({
	type: z.literal('email.suppressed'),
	created_at: z.string(),
	data: z
		.object({
			email_id: z.string(),
			from: z.string(),
			to: z.array(z.string()),
			subject: z.string().optional(),
			created_at: z.string(),
			suppressed: z
				.object({
					message: z.string().optional(),
					type: z.string().optional(),
				})
				.optional(),
		})
		.catchall(z.unknown()),
});
export type EmailSuppressedEvent = z.infer<typeof EmailSuppressedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Domain event schemas
// ─────────────────────────────────────────────────────────────────────────────

const DomainStatusSchema = z.enum([
	'not_started',
	'validation',
	'scheduled',
	'ready',
	'error',
	'verified',
	'pending',
	'failed',
	'partially_verified',
	'partially_failed',
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

export const DomainDeletedEventSchema = z.object({
	type: z.literal('domain.deleted'),
	created_at: z.string(),
	data: z
		.object({
			id: z.string(),
			name: z.string().optional(),
		})
		.catchall(z.unknown()),
});
export type DomainDeletedEvent = z.infer<typeof DomainDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Contact event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ContactCreatedEventSchema = z.object({
	type: z.literal('contact.created'),
	created_at: z.string(),
	data: z
		.object({
			id: z.string(),
			email: z.string().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			created_at: z.string().optional(),
			unsubscribed: z.boolean().optional(),
		})
		.catchall(z.unknown()),
});
export type ContactCreatedEvent = z.infer<typeof ContactCreatedEventSchema>;

export const ContactUpdatedEventSchema = z.object({
	type: z.literal('contact.updated'),
	created_at: z.string(),
	data: z
		.object({
			id: z.string(),
			email: z.string().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			created_at: z.string().optional(),
			unsubscribed: z.boolean().optional(),
		})
		.catchall(z.unknown()),
});
export type ContactUpdatedEvent = z.infer<typeof ContactUpdatedEventSchema>;

export const ContactDeletedEventSchema = z.object({
	type: z.literal('contact.deleted'),
	created_at: z.string(),
	data: z
		.object({
			id: z.string(),
			email: z.string().optional(),
		})
		.catchall(z.unknown()),
});
export type ContactDeletedEvent = z.infer<typeof ContactDeletedEventSchema>;

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
	EmailScheduledEventSchema,
	EmailSuppressedEventSchema,
	DomainCreatedEventSchema,
	DomainUpdatedEventSchema,
	DomainDeletedEventSchema,
	ContactCreatedEventSchema,
	ContactUpdatedEventSchema,
	ContactDeletedEventSchema,
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
	| 'email.scheduled'
	| 'email.suppressed'
	| 'domain.created'
	| 'domain.updated'
	| 'domain.deleted'
	| 'contact.created'
	| 'contact.updated'
	| 'contact.deleted';

export interface ResendEventMap {
	'email.bounced': EmailBouncedEvent;
	'email.clicked': EmailClickedEvent;
	'email.complained': EmailComplainedEvent;
	'email.delivered': EmailDeliveredEvent;
	'email.failed': EmailFailedEvent;
	'email.opened': EmailOpenedEvent;
	'email.received': EmailReceivedEvent;
	'email.sent': EmailSentEvent;
	'email.scheduled': EmailScheduledEvent;
	'email.suppressed': EmailSuppressedEvent;
	'domain.created': DomainCreatedEvent;
	'domain.updated': DomainUpdatedEvent;
	'domain.deleted': DomainDeletedEvent;
	'contact.created': ContactCreatedEvent;
	'contact.updated': ContactUpdatedEvent;
	'contact.deleted': ContactDeletedEvent;
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
	emailScheduled: EmailScheduledEvent;
	emailSuppressed: EmailSuppressedEvent;
	domainCreated: DomainCreatedEvent;
	domainUpdated: DomainUpdatedEvent;
	domainDeleted: DomainDeletedEvent;
	contactCreated: ContactCreatedEvent;
	contactUpdated: ContactUpdatedEvent;
	contactDeleted: ContactDeletedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

const SVIX_TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

function firstHeader(
	headers: Record<string, unknown>,
	name: string,
): string | undefined {
	const value = headers[name];
	return Array.isArray(value) ? value[0] : (value as string | undefined);
}

/**
 * Verify a Resend webhook request using Svix-compatible signatures.
 *
 * Resend delivers webhooks through Svix. A request carries `svix-id`,
 * `svix-timestamp`, and `svix-signature` headers, and the signing secret is a
 * Base64-encoded key with a `whsec_` prefix. The signed content is
 * `${id}.${timestamp}.${rawBody}` and valid signatures appear as space
 * separated `v1,<base64>` entries in the `svix-signature` header.
 *
 * See https://resend.com/docs/webhooks/verify-webhooks-requests
 */
export function verifyResendWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const id = firstHeader(headers, 'svix-id');
	const timestamp = firstHeader(headers, 'svix-timestamp');
	const signatureHeader = firstHeader(headers, 'svix-signature');

	if (!id || !timestamp || !signatureHeader) {
		return {
			valid: false,
			error: 'Missing svix-id, svix-timestamp, or svix-signature header',
		};
	}

	const timestampSeconds = Number.parseInt(timestamp, 10);
	if (!Number.isFinite(timestampSeconds)) {
		return { valid: false, error: 'Invalid svix-timestamp header' };
	}

	const nowSeconds = Math.floor(Date.now() / 1000);
	if (
		Math.abs(nowSeconds - timestampSeconds) > SVIX_TIMESTAMP_TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'Webhook timestamp outside tolerance' };
	}

	let signingKey: Buffer;
	try {
		const secretMaterial = webhookSecret.startsWith('whsec_')
			? webhookSecret.slice('whsec_'.length)
			: webhookSecret;
		signingKey = Buffer.from(secretMaterial, 'base64');
	} catch {
		return { valid: false, error: 'Invalid webhook secret encoding' };
	}

	const signedContent = `${id}.${timestamp}.${rawBody}`;
	const expected = createHmac('sha256', signingKey)
		.update(signedContent)
		.digest('base64');

	const providedSignatures = signatureHeader
		.split(' ')
		.map((entry) => entry.trim())
		.filter(Boolean);

	for (const entry of providedSignatures) {
		const [version, value] = entry.split(',');
		if (version !== 'v1' || !value) {
			// Also accept old sha256= format for backwards compatibility
			if (entry.startsWith('sha256=')) {
				const oldHex = entry.slice('sha256='.length);
				const oldKey = webhookSecret.startsWith('whsec_')
					? webhookSecret.slice('whsec_'.length)
					: webhookSecret;
				const oldExpected = createHmac('sha256', Buffer.from(oldKey, 'base64'))
					.update(signedContent)
					.digest('hex');
				if (timingSafeEqualHex(oldHex, oldExpected)) {
					return { valid: true };
				}
			}
			continue;
		}
		if (timingSafeEqualBase64(value, expected)) {
			return { valid: true };
		}
	}

	return { valid: false, error: 'Invalid signature' };
}

function timingSafeEqualBase64(a: string, b: string): boolean {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) {
		return false;
	}
	return bufA.equals(bufB);
}

function timingSafeEqualHex(a: string, b: string): boolean {
	const bufA = Buffer.from(a, 'hex');
	const bufB = Buffer.from(b, 'hex');
	if (bufA.length !== bufB.length) {
		return false;
	}
	return bufA.equals(bufB);
}

export function createResendEventMatch(type: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return typeof parsedBody.type === 'string' && parsedBody.type === type;
	};
}

export const createResendMatch = createResendEventMatch;
