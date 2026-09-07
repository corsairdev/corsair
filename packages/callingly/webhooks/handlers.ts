import { logEventFromContext, readBodyRecord } from 'corsair/core';
import type { CallinglyWebhooks } from '..';
import {
	CallinglyWebhookEventSchemas,
	verifyCallinglyWebhookSignature,
} from './types';

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
		const signingKey = ctx.key;
		if (signingKey) {
			const verification = verifyCallinglyWebhookSignature(request, signingKey);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
		}

		const event = CallinglyWebhookEventSchemas.callCompleted.parse(
			request.payload,
		);

		const entityId = String(event.call_id ?? event.id ?? '');

		if (ctx.db.calls && entityId) {
			try {
				await ctx.db.calls.upsertByEntityId(entityId, {
					id: entityId,
					lead_id: event.lead_id,
					team_id: event.team_id,
					user_id: event.user_id,
					phone_number: event.phone_number,
					status: event.status,
					duration: event.duration,
					recording_url: event.recording_url,
					outcome: event.outcome,
					created_at: event.timestamp,
				});
			} catch (error) {
				console.warn(
					'Failed to save call from webhook to local database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'callingly.webhook.callCompleted',
			{ callId: entityId },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
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
		const signingKey = ctx.key;
		if (signingKey) {
			const verification = verifyCallinglyWebhookSignature(request, signingKey);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
		}

		const event = CallinglyWebhookEventSchemas.leadCreated.parse(
			request.payload,
		);

		const entityId = String(event.lead_id ?? event.id ?? '');

		if (ctx.db.leads && entityId) {
			try {
				await ctx.db.leads.upsertByEntityId(entityId, {
					id: entityId,
					name: event.name,
					first_name: event.first_name,
					last_name: event.last_name,
					phone: event.phone_number,
					phone_number: event.phone_number,
					email: event.email,
					team_id: event.team_id,
					created_at: event.timestamp,
				});
			} catch (error) {
				console.warn(
					'Failed to save lead from webhook to local database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'callingly.webhook.leadCreated',
			{ leadId: entityId },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			data: event,
		};
	},
};
