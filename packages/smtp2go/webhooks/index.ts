import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { Smtp2goContext } from '../index';

/**
 * SMTP2GO doesn't sign deliveries. A webhook can carry an Authorization
 * header instead: set `auth_header_type` (`bearer` or `basic`) and
 * `auth_header_value` with webhooks.add or webhooks.edit, and store the same
 * value as this plugin's webhook secret. Each delivery's
 * `Authorization: Bearer <value>` (or `Basic <value>`) is compared with it in
 * constant time. Payloads come as JSON or form-encoded, per the webhook's
 * `output_format`. https://developers.smtp2go.com/docs/webhooks-overview
 */
export const SMTP2GO_EMAIL_EVENTS = [
	'processed',
	'delivered',
	'open',
	'click',
	'bounce',
	'spam',
	'unsubscribe',
	'resubscribe',
	'reject',
] as const;

export const SMTP2GO_SMS_EVENTS = [
	'sms_sending',
	'sms_submitted',
	'sms_delivered',
	'sms_failed',
	'sms_rejected',
] as const;

export type Smtp2goWebhookEvent =
	| (typeof SMTP2GO_EMAIL_EVENTS)[number]
	| (typeof SMTP2GO_SMS_EVENTS)[number];

const ALL_EVENTS: readonly string[] = [
	...SMTP2GO_EMAIL_EVENTS,
	...SMTP2GO_SMS_EVENTS,
];

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type Smtp2goWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifySmtp2goWebhook(
	// `unknown` payload: only the Authorization header is checked.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): Smtp2goWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No SMTP2GO webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature): use the auth_header_value of the webhook',
		};
	}
	const header = getHeader(request.headers, 'authorization')?.trim();
	if (!header) {
		return { valid: false, error: 'Missing Authorization header' };
	}
	const match = /^(bearer|basic)\s+(.+)$/i.exec(header);
	const token = match?.[2]?.trim() ?? header;
	return safeEqual(token, secret.trim())
		? { valid: true }
		: { valid: false, error: 'Invalid SMTP2GO webhook Authorization header' };
}

// unknown: the delivery body as JSON, a form-encoded string, or already parsed.
export function parseSmtp2goPayload(
	body: unknown,
): Record<string, unknown> | undefined {
	if (typeof body === 'string') {
		const text = body.trim();
		if (text.startsWith('{')) {
			try {
				return parseSmtp2goPayload(JSON.parse(text));
			} catch {
				return undefined;
			}
		}
		const params = new URLSearchParams(text);
		const out: Record<string, unknown> = {};
		for (const [key, value] of params) out[key] = value;
		return Object.keys(out).length > 0 ? out : undefined;
	}
	if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
		return body as Record<string, unknown>;
	}
	return undefined;
}

function eventOf(body: unknown): string | undefined {
	const value = parseSmtp2goPayload(body)?.event;
	return typeof value === 'string' ? value : undefined;
}

// The documented webhook parameters; everything optional and the object
// loose, since SMTP2GO sends different fields per event and custom headers
// the webhook asked for.
const EmailEventSchema = z
	.object({
		event: z.string(),
		id: z.union([z.string(), z.number()]).nullish(),
		email_id: z.string().nullish(),
		'message-id': z.string().nullish(),
		time: z.union([z.string(), z.number()]).nullish(),
		sendtime: z.union([z.string(), z.number()]).nullish(),
		sender: z.string().nullish(),
		from: z.string().nullish(),
		from_address: z.string().nullish(),
		from_name: z.string().nullish(),
		rcpt: z.string().nullish(),
		recipients: z.union([z.string(), z.array(z.string())]).nullish(),
		subject: z.string().nullish(),
		auth: z.string().nullish(),
		host: z.string().nullish(),
		message: z.string().nullish(),
		bounce: z.string().nullish(),
		'user-agent': z.string().nullish(),
		'read-secs': z.union([z.string(), z.number()]).nullish(),
		client: z.string().nullish(),
		'client-device': z.string().nullish(),
		'client-os': z.string().nullish(),
		'geoip-country': z.string().nullish(),
		srchost: z.string().nullish(),
	})
	.loose();

const SmsEventSchema = z
	.object({
		event: z.string(),
		id: z.union([z.string(), z.number()]).nullish(),
		message_id: z.string().nullish(),
		destination_number: z.string().nullish(),
		source_number: z.string().nullish(),
		sender_email: z.string().nullish(),
		status_code: z.union([z.string(), z.number()]).nullish(),
		region: z.string().nullish(),
		retry_count: z.union([z.string(), z.number()]).nullish(),
		received_timestamp: z.union([z.string(), z.number()]).nullish(),
		submitted_timestamp: z.union([z.string(), z.number()]).nullish(),
	})
	.loose();

export type Smtp2goEmailEvent = z.output<typeof EmailEventSchema>;
export type Smtp2goSmsEvent = z.output<typeof SmsEventSchema>;

/** A delivery this plugin handles: one of SMTP2GO's email or SMS events. */
export function isSmtp2goDelivery(request: RawWebhookRequest): boolean {
	return ALL_EVENTS.includes(eventOf(request.body) ?? '');
}

type Kind = 'email' | 'sms';

function smtp2goWebhook<K extends Kind>(
	kind: K,
): CorsairWebhook<
	Smtp2goContext,
	K extends 'email' ? Smtp2goEmailEvent : Smtp2goSmsEvent,
	K extends 'email' ? Smtp2goEmailEvent : Smtp2goSmsEvent
> {
	const events: readonly string[] =
		kind === 'email' ? SMTP2GO_EMAIL_EVENTS : SMTP2GO_SMS_EVENTS;
	const schema = kind === 'email' ? EmailEventSchema : SmsEventSchema;
	return {
		match: (request) => events.includes(eventOf(request.body) ?? ''),
		handler: async (ctx, request) => {
			const verification = verifySmtp2goWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = schema.safeParse(
				parseSmtp2goPayload(request.rawBody ?? request.payload) ??
					request.payload,
			);
			if (!parsed.success) {
				// Paths only: deliveries hold recipient addresses and subjects.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `SMTP2GO ${kind} event payload did not match its documented parameters (${where})`,
				};
			}
			await logEventFromContext(
				ctx,
				`smtp2go.webhook.${kind}`,
				{ event: parsed.data.event },
				'completed',
			);
			return {
				success: true,
				data: parsed.data as K extends 'email'
					? Smtp2goEmailEvent
					: Smtp2goSmsEvent,
			};
		},
	};
}

export const smtp2goWebhooksNested = {
	email: { event: smtp2goWebhook('email') },
	sms: { event: smtp2goWebhook('sms') },
} as const;

export const smtp2goWebhookSchemas = {
	'email.event': {
		description: `An email event: ${SMTP2GO_EMAIL_EVENTS.join(', ')} (the "event" parameter)`,
		payload: EmailEventSchema,
		response: EmailEventSchema,
	},
	'sms.event': {
		description: `An SMS event: ${SMTP2GO_SMS_EVENTS.join(', ')} (the "event" parameter)`,
		payload: SmsEventSchema,
		response: SmsEventSchema,
	},
} as const;
