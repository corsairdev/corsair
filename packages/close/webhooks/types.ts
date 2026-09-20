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

export const CloseWebhookBaseEventSchema = z
	.object({
		event_type: z.string(),
		organization_id: z.string().optional(),
		object_type: z.string().optional(),
		action: z.string().optional(),
	})
	.loose();

export const CloseLeadCreatedEventSchema = CloseWebhookBaseEventSchema.extend({
	event_type: z.literal('lead.created'),
	data: CloseLead,
});
export type CloseLeadCreatedEvent = z.infer<typeof CloseLeadCreatedEventSchema>;

export const CloseLeadUpdatedEventSchema = CloseWebhookBaseEventSchema.extend({
	event_type: z.literal('lead.updated'),
	data: CloseLead,
});
export type CloseLeadUpdatedEvent = z.infer<typeof CloseLeadUpdatedEventSchema>;

export const CloseContactCreatedEventSchema =
	CloseWebhookBaseEventSchema.extend({
		event_type: z.literal('contact.created'),
		data: CloseContact,
	});
export type CloseContactCreatedEvent = z.infer<
	typeof CloseContactCreatedEventSchema
>;

export const CloseOpportunityCreatedEventSchema =
	CloseWebhookBaseEventSchema.extend({
		event_type: z.literal('opportunity.created'),
		data: CloseOpportunity,
	});
export type CloseOpportunityCreatedEvent = z.infer<
	typeof CloseOpportunityCreatedEventSchema
>;

export const CloseTaskCreatedEventSchema = CloseWebhookBaseEventSchema.extend({
	event_type: z.literal('task.created'),
	data: CloseTask,
});
export type CloseTaskCreatedEvent = z.infer<typeof CloseTaskCreatedEventSchema>;

export const CloseActivityNoteCreatedEventSchema =
	CloseWebhookBaseEventSchema.extend({
		event_type: z.literal('activity.note.created'),
		data: CloseActivityNote,
	});
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
