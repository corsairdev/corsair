import { createHmac, timingSafeEqual } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { z } from 'zod';
import {
	CloseActivityNote,
	CloseContact,
	CloseLead,
	CloseOpportunity,
	CloseTask,
} from '../schema/database';

export const CLOSE_TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const value = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(value)) {
		return value[0];
	}
	return value;
}

export function verifyCloseWebhookSignature(
	request: WebhookRequest<unknown>,
	signatureKey?: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) {
		return { valid: true };
	}

	if (!signatureKey) {
		return { valid: false, error: 'Missing webhook signature key' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const hash = headerValue(request.headers, 'close-sig-hash');
	const timestamp = headerValue(request.headers, 'close-sig-timestamp');
	if (!hash || !timestamp) {
		return {
			valid: false,
			error: 'Missing close-sig-hash or close-sig-timestamp header',
		};
	}

	const sentAtMs = Number(timestamp);
	if (!Number.isFinite(sentAtMs)) {
		return { valid: false, error: 'Invalid close-sig-timestamp header' };
	}
	if (Math.abs(Date.now() - sentAtMs * 1000) > CLOSE_TIMESTAMP_TOLERANCE_MS) {
		return { valid: false, error: 'Stale close-sig-timestamp header' };
	}

	try {
		const key = Buffer.from(signatureKey, 'hex');
		const expected = createHmac('sha256', key)
			.update(timestamp + rawBody)
			.digest('hex');
		const actual = Buffer.from(hash);
		const expectedBuf = Buffer.from(expected);
		if (
			actual.length !== expectedBuf.length ||
			!timingSafeEqual(actual, expectedBuf)
		) {
			return { valid: false, error: 'Invalid signature' };
		}
		return { valid: true };
	} catch {
		return { valid: false, error: 'Invalid signature' };
	}
}

export const CloseWebhookEventSchema = z
	.object({
		id: z.string().optional(),
		object_type: z.string(),
		object_id: z.string().optional(),
		action: z.string(),
		organization_id: z.string().optional(),
		data: z.unknown().optional(),
		previous_data: z.unknown().optional(),
		changed_fields: z.array(z.string()).optional(),
		date_created: z.string().optional(),
		date_updated: z.string().optional(),
		user_id: z.string().optional(),
		lead_id: z.string().optional(),
		request_id: z.string().optional(),
	})
	.loose();

export const CloseWebhookEnvelopeSchema = z
	.object({
		subscription_id: z.string().optional(),
		event: CloseWebhookEventSchema,
	})
	.loose();

function closeWebhookEventSchema<
	const TType extends string,
	const TAction extends string,
	TData extends z.ZodTypeAny,
>(objectType: TType, action: TAction, data: TData) {
	return CloseWebhookEnvelopeSchema.extend({
		event: CloseWebhookEventSchema.extend({
			object_type: z.literal(objectType),
			action: z.literal(action),
			data,
		}),
	});
}

export const CloseLeadCreatedEventSchema = closeWebhookEventSchema(
	'lead',
	'created',
	CloseLead,
);
export type CloseLeadCreatedEvent = z.infer<typeof CloseLeadCreatedEventSchema>;

export const CloseLeadUpdatedEventSchema = closeWebhookEventSchema(
	'lead',
	'updated',
	CloseLead,
);
export type CloseLeadUpdatedEvent = z.infer<typeof CloseLeadUpdatedEventSchema>;

export const CloseContactCreatedEventSchema = closeWebhookEventSchema(
	'contact',
	'created',
	CloseContact,
);
export type CloseContactCreatedEvent = z.infer<
	typeof CloseContactCreatedEventSchema
>;

export const CloseOpportunityCreatedEventSchema = closeWebhookEventSchema(
	'opportunity',
	'created',
	CloseOpportunity,
);
export type CloseOpportunityCreatedEvent = z.infer<
	typeof CloseOpportunityCreatedEventSchema
>;

export const CloseTaskCreatedEventSchema = CloseWebhookEnvelopeSchema.extend({
	event: CloseWebhookEventSchema.extend({
		object_type: z.string(),
		action: z.literal('created'),
		data: CloseTask,
	}),
});
export type CloseTaskCreatedEvent = z.infer<typeof CloseTaskCreatedEventSchema>;

export const CloseActivityNoteCreatedEventSchema = closeWebhookEventSchema(
	'activity.note',
	'created',
	CloseActivityNote,
);
export type CloseActivityNoteCreatedEvent = z.infer<
	typeof CloseActivityNoteCreatedEventSchema
>;

export type CloseWebhookOutputs = {
	leadCreated: CloseLeadCreatedEvent;
	leadUpdated: CloseLeadUpdatedEvent;
	contactCreated: CloseContactCreatedEvent;
	opportunityCreated: CloseOpportunityCreatedEvent;
	taskCreated: CloseTaskCreatedEvent;
	activityNoteCreated: CloseActivityNoteCreatedEvent;
};
