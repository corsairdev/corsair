import { logEventFromContext } from 'corsair/core';
import type { FathomAiWebhooks } from '..';
import { isFathomAiDelivery, verifyFathomAiWebhook } from './types';

export const contentReady: FathomAiWebhooks['meetingContentReady'] = {
	match: isFathomAiDelivery,

	handler: async (ctx, request) => {
		const verification = verifyFathomAiWebhook(request, ctx.key);
		if (!verification.valid) {
			return { success: false, statusCode: 401, error: verification.error };
		}

		const meeting = request.payload;
		const entity = await ctx.db.meetings.upsertByEntityId(
			String(meeting.recording_id),
			meeting,
		);
		await logEventFromContext(
			ctx,
			'fathomai.webhook.meetings.contentReady',
			{ recording_id: meeting.recording_id },
			'completed',
		);

		return { success: true, corsairEntityId: entity?.id, data: meeting };
	},
};
