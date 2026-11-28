import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { DocuSealContext } from '../index';

/**
 * DocuSeal signs every delivery (lib/webhook_urls/signatures.rb):
 *
 *   X-Docuseal-Signature: <unix seconds>.<hex HMAC-SHA256 of "<seconds>.<raw body>">
 *
 * keyed by the webhook's signing secret (`whsec_...`, shown next to the
 * webhook URL in DocuSeal's settings). DocuSeal's own verifier rejects a
 * timestamp more than five minutes from now; this check does the same.
 * Custom secret headers set on the webhook are sent as well, and a custom
 * `X-Docuseal-Signature` header replaces the computed one, in which case
 * the delivery can't be checked here. Checked against real deliveries from
 * self-hosted DocuSeal 3.4.0 (11-28).
 */
export const DOCUSEAL_SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type DocuSealWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyDocuSealWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	nowSeconds: number = Math.floor(Date.now() / 1000),
): DocuSealWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No DocuSeal webhook signing secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const header = getHeader(request.headers, 'x-docuseal-signature')?.trim();
	if (!header) {
		return { valid: false, error: 'Missing X-Docuseal-Signature header' };
	}
	const dot = header.indexOf('.');
	const timestamp = dot > 0 ? Number(header.slice(0, dot)) : Number.NaN;
	const signature = dot > 0 ? header.slice(dot + 1).toLowerCase() : '';
	if (!Number.isInteger(timestamp) || !signature) {
		return { valid: false, error: 'Malformed X-Docuseal-Signature header' };
	}
	if (Math.abs(nowSeconds - timestamp) > DOCUSEAL_SIGNATURE_TOLERANCE_SECONDS) {
		return {
			valid: false,
			error: 'DocuSeal webhook timestamp is outside the 5-minute window',
		};
	}
	const expected = createHmac('sha256', secret)
		.update(`${timestamp}.${request.rawBody}`)
		.digest('hex');
	return safeEqual(signature, expected)
		? { valid: true }
		: { valid: false, error: 'Invalid DocuSeal webhook signature' };
}

// Payloads follow the spec's *Event schemas (console.docuseal.com/openapi.json
// `webhooks`). Fields are optional and objects loose: a field DocuSeal adds
// or drops must not fail a delivery that already happened.
const RefSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		external_id: z.string().nullish(),
	})
	.loose();

const SubmitterEventDataSchema = z
	.object({
		id: z.number(),
		submission_id: z.number().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		name: z.string().nullish(),
		role: z.string().nullish(),
		external_id: z.string().nullish(),
		status: z.string().nullish(),
		sent_at: z.string().nullish(),
		opened_at: z.string().nullish(),
		completed_at: z.string().nullish(),
		declined_at: z.string().nullish(),
		decline_reason: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		values: z.array(z.object({}).loose()).nullish(),
		documents: z
			.array(z.object({ name: z.string(), url: z.string() }).loose())
			.nullish(),
		audit_log_url: z.string().nullish(),
		submission_url: z.string().nullish(),
		submission: z
			.object({
				id: z.number().nullish(),
				status: z.string().nullish(),
				url: z.string().nullish(),
				audit_log_url: z.string().nullish(),
				combined_document_url: z.string().nullish(),
				created_at: z.string().nullish(),
			})
			.loose()
			.nullish(),
		template: RefSchema.nullish(),
	})
	.loose();

const SubmissionEventDataSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		source: z.string().nullish(),
		slug: z.string().nullish(),
		audit_log_url: z.string().nullish(),
		combined_document_url: z.string().nullish(),
		expire_at: z.string().nullish(),
		completed_at: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		archived_at: z.string().nullish(),
		submitters: z.array(z.object({}).loose()).nullish(),
		documents: z.array(z.object({}).loose()).nullish(),
		template: RefSchema.nullish(),
		created_by_user: z.object({}).loose().nullish(),
	})
	.loose();

const TemplateEventDataSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		external_id: z.string().nullish(),
		folder_id: z.number().nullish(),
		folder_name: z.string().nullish(),
		archived_at: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		submitters: z.array(z.object({}).loose()).nullish(),
		fields: z.array(z.object({}).loose()).nullish(),
		documents: z.array(z.object({}).loose()).nullish(),
		author: z.object({}).loose().nullish(),
	})
	.loose();

function envelope<Data extends z.ZodType>(eventType: string, data: Data) {
	return z
		.object({
			event_type: z.literal(eventType),
			timestamp: z.string(),
			data,
		})
		.loose();
}

const WEBHOOKS = {
	formViewed: {
		eventType: 'form.viewed',
		summary: 'A submitter opened the signing form',
		schema: envelope('form.viewed', SubmitterEventDataSchema),
	},
	formStarted: {
		eventType: 'form.started',
		summary: 'A submitter started filling in the form',
		schema: envelope('form.started', SubmitterEventDataSchema),
	},
	formCompleted: {
		eventType: 'form.completed',
		summary: 'A submitter completed and signed the form',
		schema: envelope('form.completed', SubmitterEventDataSchema),
	},
	formDeclined: {
		eventType: 'form.declined',
		summary: 'A submitter declined to sign',
		schema: envelope('form.declined', SubmitterEventDataSchema),
	},
	submissionCreated: {
		eventType: 'submission.created',
		summary: 'A submission was created',
		schema: envelope('submission.created', SubmissionEventDataSchema),
	},
	submissionCompleted: {
		eventType: 'submission.completed',
		summary: 'Every submitter of a submission completed it',
		schema: envelope('submission.completed', SubmissionEventDataSchema),
	},
	submissionExpired: {
		eventType: 'submission.expired',
		summary: 'A submission passed its expiry date',
		schema: envelope('submission.expired', SubmissionEventDataSchema),
	},
	submissionArchived: {
		eventType: 'submission.archived',
		summary: 'A submission was archived',
		schema: envelope('submission.archived', SubmissionEventDataSchema),
	},
	templateCreated: {
		eventType: 'template.created',
		summary: 'A template was created',
		schema: envelope('template.created', TemplateEventDataSchema),
	},
	templateUpdated: {
		eventType: 'template.updated',
		summary: 'A template was changed',
		schema: envelope('template.updated', TemplateEventDataSchema),
	},
	templateArchived: {
		eventType: 'template.archived',
		summary: 'A template was archived',
		schema: envelope('template.archived', TemplateEventDataSchema),
	},
} as const;

export type DocuSealWebhookId = keyof typeof WEBHOOKS;

export type DocuSealWebhookPayloads = {
	[Id in DocuSealWebhookId]: z.output<(typeof WEBHOOKS)[Id]['schema']>;
};

const WEBHOOK_IDS = Object.keys(WEBHOOKS) as DocuSealWebhookId[];

// unknown: the parsed delivery body, before it is matched to an event.
function eventTypeOf(payload: unknown): string | undefined {
	if (typeof payload === 'string') {
		try {
			return eventTypeOf(JSON.parse(payload));
		} catch {
			return undefined;
		}
	}
	if (typeof payload !== 'object' || payload === null) return undefined;
	const value = (payload as { event_type?: unknown }).event_type;
	return typeof value === 'string' ? value : undefined;
}

export function webhookIdFor(
	eventType: string | undefined,
): DocuSealWebhookId | undefined {
	return WEBHOOK_IDS.find((id) => WEBHOOKS[id].eventType === eventType);
}

/**
 * A DocuSeal delivery: a signature header next to an `event_type` this plugin
 * handles. The header alone isn't enough (it could be any service's), and the
 * event type alone could be another vendor's.
 */
export function isDocuSealDelivery(request: RawWebhookRequest): boolean {
	if (!getHeader(request.headers, 'x-docuseal-signature')) return false;
	return webhookIdFor(eventTypeOf(request.body)) !== undefined;
}

export type DocuSealWebhook<Id extends DocuSealWebhookId> = CorsairWebhook<
	DocuSealContext,
	DocuSealWebhookPayloads[Id],
	DocuSealWebhookPayloads[Id]
>;

function docuSealWebhook<Id extends DocuSealWebhookId>(
	id: Id,
): DocuSealWebhook<Id> {
	return {
		match: (request) => webhookIdFor(eventTypeOf(request.body)) === id,
		handler: async (ctx, request) => {
			const verification = verifyDocuSealWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = WEBHOOKS[id].schema.safeParse(request.payload);
			if (!parsed.success) {
				// Paths only: the payload holds names, emails and form values.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `DocuSeal ${WEBHOOKS[id].eventType} payload did not match its documented schema (${where})`,
				};
			}
			const event = parsed.data as DocuSealWebhookPayloads[Id];
			await logEventFromContext(
				ctx,
				`docuseal.webhook.${id}`,
				// The event type and record id only: the payload holds personal data.
				{ eventType: event.event_type, id: event.data.id },
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const docuSealWebhooksNested = {
	form: {
		viewed: docuSealWebhook('formViewed'),
		started: docuSealWebhook('formStarted'),
		completed: docuSealWebhook('formCompleted'),
		declined: docuSealWebhook('formDeclined'),
	},
	submission: {
		created: docuSealWebhook('submissionCreated'),
		completed: docuSealWebhook('submissionCompleted'),
		expired: docuSealWebhook('submissionExpired'),
		archived: docuSealWebhook('submissionArchived'),
	},
	template: {
		created: docuSealWebhook('templateCreated'),
		updated: docuSealWebhook('templateUpdated'),
		archived: docuSealWebhook('templateArchived'),
	},
} as const;

function entry(id: DocuSealWebhookId) {
	const webhook = WEBHOOKS[id];
	return {
		description: `${webhook.summary} (event_type ${webhook.eventType})`,
		payload: webhook.schema,
		response: webhook.schema,
	};
}

export const docuSealWebhookSchemas = {
	'form.viewed': entry('formViewed'),
	'form.started': entry('formStarted'),
	'form.completed': entry('formCompleted'),
	'form.declined': entry('formDeclined'),
	'submission.created': entry('submissionCreated'),
	'submission.completed': entry('submissionCompleted'),
	'submission.expired': entry('submissionExpired'),
	'submission.archived': entry('submissionArchived'),
	'template.created': entry('templateCreated'),
	'template.updated': entry('templateUpdated'),
	'template.archived': entry('templateArchived'),
} as const;
