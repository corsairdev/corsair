import { logEventFromContext, readBodyRecord } from 'corsair/core';
import type { CallinglyWebhooks } from '..';

export const callCompleted: CallinglyWebhooks['callCompleted'] = {
	match: (request) => {
		const body = readBodyRecord(request);
		const event = body?.event;
		return (
			event === 'call.completed' ||
			event === 'call_completed' ||
			event === 'call'
		);
	},
	handler: async (ctx, request) => {
		const event = request.payload;

		await logEventFromContext(
			ctx,
			'callingly.webhook.callCompleted',
			{ callId: event.call_id ?? event.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: String(event.call_id ?? event.id ?? ''),
			data: event,
		};
	},
};

export const leadCreated: CallinglyWebhooks['leadCreated'] = {
	match: (request) => {
		const body = readBodyRecord(request);
		const event = body?.event;
		return (
			event === 'lead.created' || event === 'lead_created' || event === 'lead'
		);
	},
	handler: async (ctx, request) => {
		const event = request.payload;

		await logEventFromContext(
			ctx,
			'callingly.webhook.leadCreated',
			{ leadId: event.lead_id ?? event.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: String(event.lead_id ?? event.id ?? ''),
			data: event,
		};
	},
};
