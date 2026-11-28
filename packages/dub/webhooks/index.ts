import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { DubContext } from '../index';
import { DUB_WEBHOOK_EVENTS } from './events-generated';

/**
 * Dub signs every delivery with the webhook's secret
 * (apps/web/lib/webhook/signature.ts in dubinc/dub):
 *
 *   Dub-Signature: <hex HMAC-SHA256 of the raw JSON body, keyed by the secret>
 *
 * There is no timestamp in the signature; the payload's `id` is unique per
 * event, so use it to skip a delivery already handled. Event names come from
 * the *Event schemas of Dub's OpenAPI file.
 */
function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type DubWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyDubWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): DubWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Dub webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const signature = getHeader(request.headers, 'dub-signature')?.trim();
	if (!signature) {
		return { valid: false, error: 'Missing Dub-Signature header' };
	}
	const expected = createHmac('sha256', secret)
		.update(request.rawBody)
		.digest('hex');
	return safeEqual(signature.toLowerCase(), expected)
		? { valid: true }
		: { valid: false, error: 'Invalid Dub webhook signature' };
}

export type DubWebhookEvent = (typeof DUB_WEBHOOK_EVENTS)[number];

// Every Dub event shares this envelope; `data` differs per event (a link, a
// click with its link, a lead or sale with customer and link, a partner, a
// commission, a discount code, a message). It stays a loose object: a field
// Dub adds or drops must not fail a delivery that already happened.
function envelope(event: DubWebhookEvent) {
	return z
		.object({
			id: z.string(),
			event: z.literal(event),
			createdAt: z.string().nullish(),
			data: z.object({}).loose(),
		})
		.loose();
}

export type DubWebhookPayload<E extends DubWebhookEvent> = z.output<
	ReturnType<typeof envelope>
> & { event: E };

// unknown: the delivery body, before it is matched to an event.
function eventOf(body: unknown): string | undefined {
	if (typeof body === 'string') {
		try {
			return eventOf(JSON.parse(body));
		} catch {
			return undefined;
		}
	}
	if (typeof body !== 'object' || body === null) return undefined;
	const value = (body as { event?: unknown }).event;
	return typeof value === 'string' ? value : undefined;
}

function isDubEvent(value: string | undefined): value is DubWebhookEvent {
	return (DUB_WEBHOOK_EVENTS as readonly string[]).includes(value ?? '');
}

/** A Dub delivery: the Dub-Signature header and an event this plugin handles. */
export function isDubDelivery(request: RawWebhookRequest): boolean {
	if (!getHeader(request.headers, 'dub-signature')) return false;
	return isDubEvent(eventOf(request.body));
}

export type DubWebhook<E extends DubWebhookEvent> = CorsairWebhook<
	DubContext,
	DubWebhookPayload<E>,
	DubWebhookPayload<E>
>;

function dubWebhook<E extends DubWebhookEvent>(event: E): DubWebhook<E> {
	const schema = envelope(event);
	return {
		match: (request) => eventOf(request.body) === event,
		handler: async (ctx, request) => {
			const verification = verifyDubWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = schema.safeParse(request.payload);
			if (!parsed.success) {
				// Paths only: payloads hold customer emails and link URLs.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `Dub ${event} payload did not match its documented schema (${where})`,
				};
			}
			const payload = parsed.data as DubWebhookPayload<E>;
			await logEventFromContext(
				ctx,
				`dub.webhook.${event}`,
				{ event, id: payload.id },
				'completed',
			);
			return { success: true, data: payload };
		},
	};
}

export const dubWebhooksNested = {
	link: {
		created: dubWebhook('link.created'),
		updated: dubWebhook('link.updated'),
		deleted: dubWebhook('link.deleted'),
		clicked: dubWebhook('link.clicked'),
	},
	lead: { created: dubWebhook('lead.created') },
	sale: { created: dubWebhook('sale.created') },
	partner: {
		enrolled: dubWebhook('partner.enrolled'),
		applicationSubmitted: dubWebhook('partner.application_submitted'),
		merged: dubWebhook('partner.merged'),
	},
	programApplication: { created: dubWebhook('program_application.created') },
	commission: { created: dubWebhook('commission.created') },
	discountCode: {
		created: dubWebhook('discount_code.created'),
		deleted: dubWebhook('discount_code.deleted'),
	},
	message: { received: dubWebhook('message.received') },
} as const;

const SUMMARIES: Record<DubWebhookEvent, string> = {
	'link.created': 'A short link was created',
	'link.updated': 'A short link was changed',
	'link.deleted': 'A short link was deleted',
	'link.clicked': 'A short link was clicked',
	'lead.created': 'A lead conversion was tracked',
	'sale.created': 'A sale conversion was tracked',
	'partner.enrolled': 'A partner joined the program',
	'partner.application_submitted': 'A partner applied to the program',
	'program_application.created': 'A program application was created',
	'partner.merged': 'Two partner accounts were merged',
	'commission.created': 'A commission was created for a partner',
	'discount_code.created': 'A discount code was created',
	'discount_code.deleted': 'A discount code was deleted',
	'message.received': 'A partner sent the program a message',
};

function entry(event: DubWebhookEvent) {
	const schema = envelope(event);
	return {
		description: `${SUMMARIES[event]} (event ${event})`,
		payload: schema,
		response: schema,
	};
}

export const dubWebhookSchemas = {
	'link.created': entry('link.created'),
	'link.updated': entry('link.updated'),
	'link.deleted': entry('link.deleted'),
	'link.clicked': entry('link.clicked'),
	'lead.created': entry('lead.created'),
	'sale.created': entry('sale.created'),
	'partner.enrolled': entry('partner.enrolled'),
	'partner.applicationSubmitted': entry('partner.application_submitted'),
	'partner.merged': entry('partner.merged'),
	'programApplication.created': entry('program_application.created'),
	'commission.created': entry('commission.created'),
	'discountCode.created': entry('discount_code.created'),
	'discountCode.deleted': entry('discount_code.deleted'),
	'message.received': entry('message.received'),
} as const;
