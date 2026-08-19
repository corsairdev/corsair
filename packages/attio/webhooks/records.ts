import type { WebhookRequest, WebhookResponse } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { AttioWebhooks } from '../index';
import type { AttioWebhookPayload } from './types';
import { createAttioMatch, verifyAttioWebhookSignature } from './types';

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

	const event = request.payload;
	const entityId = event.id.record_id;
	const record = {
		id: {
			workspace_id: event.id.workspace_id,
			object_id: event.id.object_id ?? event.id.record_id,
			record_id: event.id.record_id,
		},
	};

	if (ctx.db.records) {
		try {
			if (kind === 'deleted') {
				await ctx.db.records.deleteByEntityId(entityId);
			} else {
				await ctx.db.records.upsertByEntityId(entityId, record);
			}
		} catch {
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to persist record',
			};
		}
	}

	await logEventFromContext(
		ctx,
		`attio.webhook.record.${kind}`,
		{ event_type: event.event_type, id: event.id },
		'completed',
	);

	return {
		success: true,
		corsairEntityId: entityId,
		data: event,
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
