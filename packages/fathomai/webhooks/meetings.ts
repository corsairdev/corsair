import { getHeader, logEventFromContext } from 'corsair/core';
import type { FathomAiWebhooks } from '..';
import { storableMeeting } from '../endpoints/types';
import {
	claimFathomAiDelivery,
	isFathomAiDelivery,
	releaseFathomAiDelivery,
	verifyFathomAiWebhook,
} from './types';

type Ctx = Parameters<FathomAiWebhooks['meetingContentReady']['handler']>[0];

// Delivery ids are remembered per account, so two accounts receiving one delivery each handle it.
async function deliveryScope(ctx: Ctx): Promise<string> {
	try {
		return await ctx.$getAccountId();
	} catch {
		return '';
	}
}

export const contentReady: FathomAiWebhooks['meetingContentReady'] = {
	match: isFathomAiDelivery,

	handler: async (ctx, request) => {
		const verification = verifyFathomAiWebhook(request, ctx.key);
		if (!verification.valid) {
			return { success: false, statusCode: 401, error: verification.error };
		}

		// Verification passed, so the header is present unless the hub verified the delivery.
		const deliveryId = getHeader(request.headers, 'webhook-id');
		const scope = deliveryId ? await deliveryScope(ctx) : '';
		if (deliveryId && !claimFathomAiDelivery(scope, deliveryId)) {
			// success false keeps webhookHooks.after from running again; 200 tells Fathom
			// the delivery was accepted, so it stops retrying.
			return { success: false, statusCode: 200, error: 'Duplicate delivery' };
		}

		try {
			const meeting = request.payload;
			const entity = await ctx.db.meetings.upsertByEntityId(
				String(meeting.recording_id),
				storableMeeting(meeting),
			);
			await logEventFromContext(
				ctx,
				'fathomai.webhook.meetings.contentReady',
				{ recording_id: meeting.recording_id },
				'completed',
			);

			return { success: true, corsairEntityId: entity?.id, data: meeting };
		} catch (error) {
			if (deliveryId) releaseFathomAiDelivery(scope, deliveryId);
			throw error;
		}
	},
};
