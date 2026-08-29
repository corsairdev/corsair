import { logEventFromContext } from 'corsair/core';
import type { FaradayContext, FaradayWebhooks } from '..';
import {
	createFaradayMatch,
	faradayWebhookMessageId,
	verifyFaradayWebhookSignature,
} from './types';

type EventRow = { id: string };

function eventTable(ctx: FaradayContext) {
	return ctx.database?.db;
}

/** Replay is keyed by svix-id on corsair_events so every replica shares it. */
export async function recordFaradayWebhookEvent(
	ctx: FaradayContext,
	msgId: string | undefined,
	payload: Record<string, unknown>,
): Promise<'ok' | 'replay' | 'failed'> {
	const db = eventTable(ctx);
	if (db && msgId) {
		try {
			const accountId = await ctx.$getAccountId();
			const seen = await db
				.selectFrom('corsair_events')
				.select('id')
				.where('id', '=', msgId)
				.executeTakeFirst();
			if (seen) return 'replay';
			const now = new Date();
			await db
				.insertInto('corsair_events')
				.values({
					id: msgId,
					created_at: now,
					updated_at: now,
					account_id: accountId,
					event_type: 'faraday.webhook.resourceReady',
					payload,
					status: 'completed',
				})
				.execute();
			return 'ok';
		} catch {
			const again = (await db
				.selectFrom('corsair_events')
				.select('id')
				.where('id', '=', msgId)
				.executeTakeFirst()) as EventRow | undefined;
			return again ? 'replay' : 'failed';
		}
	}

	const eventId = await logEventFromContext(
		ctx,
		'faraday.webhook.resourceReady',
		payload,
		'completed',
	);
	return eventId ? 'ok' : 'failed';
}

export const resourceReady: FaradayWebhooks['resourceReady'] = {
	match: createFaradayMatch('resource.ready_with_update'),

	handler: async (ctx, request) => {
		const verification = verifyFaradayWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const recorded = await recordFaradayWebhookEvent(
			ctx,
			faradayWebhookMessageId(request.headers),
			{ ...request.payload },
		);
		if (recorded === 'replay') {
			return {
				success: false,
				statusCode: 409,
				error: 'Replay: webhook message id already used',
			};
		}
		if (recorded === 'failed') {
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to record webhook event',
			};
		}

		return { success: true, data: request.payload };
	},
};
