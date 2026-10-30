import type { WebhookRequest, WebhookResponse } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { AttioWebhooks } from '../index';
import type { AttioWebhookPayload } from './types';
import {
	createAttioMatch,
	recordEventsFromPayload,
	verifyAttioWebhookSignature,
} from './types';

async function handleRecordEvent<T extends AttioWebhookPayload>(
	kind: 'created' | 'updated' | 'deleted',
	ctx: Parameters<AttioWebhooks['recordCreated']['handler']>[0],
	request: WebhookRequest<T>,
): Promise<WebhookResponse<T>> {
	const verification = verifyAttioWebhookSignature(request, ctx.key);
	if (!verification.valid) {
		return {
			success: false,
			statusCode: 401,
			error: verification.error || 'Signature verification failed',
		};
	}

	const events = recordEventsFromPayload(request.payload, `record.${kind}`);
	if (events.length === 0) {
		return {
			success: false,
			statusCode: 400,
			error: 'No matching Attio record events in payload',
		};
	}

	try {
		for (const event of events) {
			const entityId = event.id.record_id;
			const record = {
				id: {
					workspace_id: event.id.workspace_id,
					object_id: event.id.object_id ?? event.id.record_id,
					record_id: event.id.record_id,
				},
			};

			if (!ctx.db.records) continue;
			if (kind === 'deleted') {
				await ctx.db.records.deleteByEntityId(entityId);
			} else {
				await ctx.db.records.upsertByEntityId(entityId, record);
			}
		}
	} catch {
		return {
			success: false,
			statusCode: 500,
			error: 'Failed to persist record',
		};
	}

	const event = events[0];
	if (!event) {
		return {
			success: false,
			statusCode: 400,
			error: 'No matching Attio record events in payload',
		};
	}
	await logEventFromContext(
		ctx,
		`attio.webhook.record.${kind}`,
		{ event_type: event.event_type, id: event.id, count: events.length },
		'completed',
	);

	return {
		success: true,
		corsairEntityId: event.id.record_id,
		data: event as T,
	};
}

export const created: AttioWebhooks['recordCreated'] = {
	match: createAttioMatch('record.created'),
	handler: async (ctx, request) => handleRecordEvent('created', ctx, request),
};

export const updated: AttioWebhooks['recordUpdated'] = {
	match: createAttioMatch('record.updated'),
	handler: async (ctx, request) => handleRecordEvent('updated', ctx, request),
};

export const deleted: AttioWebhooks['recordDeleted'] = {
	match: createAttioMatch('record.deleted'),
	handler: async (ctx, request) => handleRecordEvent('deleted', ctx, request),
};
