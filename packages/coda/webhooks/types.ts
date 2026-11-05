import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
	WebhookResponse,
} from 'corsair/core';
import { getHeader } from 'corsair/core';
import { z } from 'zod';

// Coda pushes Admin API audit events (Enterprise plan) to webhooks in batches:
// https://coda.io/developers/apis/admin/v1#section/Introduction/Webhooks

const SIGNATURE_HEADER = 'x-webhook-signature';
const HANDSHAKE_HEADER = 'x-webhook-code';

const AuditUserSchema = z.object({
	type: z.literal('user'),
	id: z.number().describe('Internal Coda ID of the user'),
	email: z.string(),
});

const AuditUserContextSchema = z
	.object({
		source: z
			.string()
			.describe('Where the action came from, e.g. browser, codaApi, system'),
	})
	.loose();

const AuditEventBaseSchema = z.object({
	eventId: z.string(),
	timestamp: z.number().describe('Unix timestamp of the event in seconds'),
	action: z.string().describe('Audit action name, e.g. CreateDoc'),
	result: z.string().describe('Result of the action, e.g. Success'),
	organizationId: z.string(),
	user: AuditUserSchema,
	userContext: AuditUserContextSchema,
	eventDetails: z.record(z.string(), z.json()).optional(),
});

export const CodaAuditDocSchema = z
	.object({
		id: z.string(),
		type: z.literal('doc'),
		docType: z.string(),
		name: z.string(),
		href: z.string(),
		browserLink: z.string(),
		folderId: z.string(),
		workspaceId: z.string(),
		owner: z.string().optional(),
		ownerName: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		isDeleted: z.boolean().optional(),
	})
	.loose();

export const CodaAuditPageSchema = z
	.object({
		id: z.string(),
		type: z.literal('page'),
		name: z.string(),
		href: z.string(),
		browserLink: z.string(),
		subtitle: z.string().optional(),
	})
	.loose();

export const CodaDocAuditEventSchema = AuditEventBaseSchema.extend({
	entity: z.object({ type: z.literal('doc'), doc: CodaAuditDocSchema }),
});
export type CodaDocAuditEvent = z.infer<typeof CodaDocAuditEventSchema>;

export const CodaPageAuditEventSchema = AuditEventBaseSchema.extend({
	entity: z.object({ type: z.literal('page'), page: CodaAuditPageSchema }),
});
export type CodaPageAuditEvent = z.infer<typeof CodaPageAuditEventSchema>;

const AuditEventSchema = AuditEventBaseSchema.extend({
	entity: z.object({ type: z.string() }).loose(),
});
type AuditEvent = z.infer<typeof AuditEventSchema>;

export const CodaAuditBatchSchema = z.object({
	events: z.array(AuditEventSchema),
});
export type CodaAuditBatch = z.infer<typeof CodaAuditBatchSchema>;

export const CodaDocEventsSchema = z.object({
	events: z.array(CodaDocAuditEventSchema),
});
export type CodaDocEvents = z.infer<typeof CodaDocEventsSchema>;

export const CodaPageEventsSchema = z.object({
	events: z.array(CodaPageAuditEventSchema),
});
export type CodaPageEvents = z.infer<typeof CodaPageEventsSchema>;

export type CodaWebhookOutputs = {
	docsCreated: CodaDocEvents;
	docsDeleted: CodaDocEvents;
	pagesCreated: CodaPageEvents;
	pagesUpdated: CodaPageEvents;
};

export type CodaEventFilter = (event: AuditEvent) => boolean;

// Coda names audit actions <Verb><Entity>; CopyDoc also produces a new doc.
export const isDocCreated: CodaEventFilter = (e) =>
	e.entity.type === 'doc' &&
	(e.action === 'CreateDoc' || e.action === 'CopyDoc');
export const isDocDeleted: CodaEventFilter = (e) =>
	e.entity.type === 'doc' && e.action === 'DeleteDoc';
export const isPageCreated: CodaEventFilter = (e) =>
	e.entity.type === 'page' && /^(Create|Copy|Add)/.test(e.action);
export const isPageUpdated: CodaEventFilter = (e) =>
	e.entity.type === 'page' && /^(Edit|Update|Rename|Move)/.test(e.action);

function isHandshake(headers: RawWebhookRequest['headers']): boolean {
	return getHeader(headers, HANDSHAKE_HEADER) !== undefined;
}

export function isCodaWebhook(request: RawWebhookRequest): boolean {
	return (
		isHandshake(request.headers) ||
		getHeader(request.headers, SIGNATURE_HEADER) !== undefined
	);
}

// Coda sends its ownership handshake to the target URL once, so any Coda webhook claims it.
export function createCodaMatch(
	filter: CodaEventFilter,
): CorsairWebhookMatcher {
	return (request) => {
		if (isHandshake(request.headers)) return true;
		if (getHeader(request.headers, SIGNATURE_HEADER) === undefined)
			return false;
		const batch = CodaAuditBatchSchema.safeParse(request.body);
		return batch.success && batch.data.events.some(filter);
	};
}

// Coda proves target ownership with a GET carrying X-Webhook-Code, which must be echoed back.
export function codaHandshakeResponse<T>(
	request: WebhookRequest<CodaAuditBatch>,
): WebhookResponse<T> | null {
	const code = getHeader(request.headers, HANDSHAKE_HEADER);
	if (code === undefined) return null;
	return {
		success: true,
		statusCode: 200,
		responseHeaders: { 'X-Webhook-Code': code },
	};
}

export function verifyCodaWebhookSignature(
	request: WebhookRequest<CodaAuditBatch>,
	signatureKey: string,
): { valid: true } | { valid: false; error: string } {
	if (request.hubVerified) return { valid: true };
	if (!signatureKey) {
		return { valid: false, error: 'Missing webhook signature key' };
	}
	const signature = getHeader(request.headers, SIGNATURE_HEADER);
	if (!signature) {
		return { valid: false, error: 'Missing X-Webhook-Signature header' };
	}
	const body = request.rawBody ?? JSON.stringify(request.payload);
	const expected = Buffer.from(
		createHmac('sha256', signatureKey).update(body).digest('hex'),
	);
	const provided = Buffer.from(signature);
	if (
		provided.length !== expected.length ||
		!timingSafeEqual(provided, expected)
	) {
		return { valid: false, error: 'Signature mismatch' };
	}
	return { valid: true };
}
