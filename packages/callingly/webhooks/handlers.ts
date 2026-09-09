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
		if (request.hubVerified !== true) {
			if (!signingKey) {
				return {
					success: false,
					statusCode: 401,
					error: 'Missing webhook signing key or secret',
				};
			}
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

		const rawId = event.call_id ?? event.id;
		if (rawId === undefined || rawId === null || rawId === '') {
			return {
				success: false,
				statusCode: 400,
				error: 'Missing call identifier (call_id or id) in webhook payload',
			};
		}

		const entityId = String(rawId);

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
		if (request.hubVerified !== true) {
			if (!signingKey) {
				return {
					success: false,
					statusCode: 401,
					error: 'Missing webhook signing key or secret',
				};
			}
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

		const rawId = event.lead_id ?? event.id;
		if (rawId === undefined || rawId === null || rawId === '') {
			return {
				success: false,
				statusCode: 400,
				error: 'Missing lead identifier (lead_id or id) in webhook payload',
			};
		}

		const entityId = String(rawId);

		if (ctx.db.leads && entityId) {
			try {
				await ctx.db.leads.upsertByEntityId(entityId, {
					id: entityId,
					name: event.name,
					fname: event.fname ?? event.first_name,
					lname: event.lname ?? event.last_name,
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
