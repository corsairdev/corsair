import { getHeader, logEventFromContext } from 'corsair/core';
import type { FathomAiPluginOptions, FathomAiWebhooks } from '..';
import { storableMeeting } from '../endpoints/types';
import {
	claimFathomAiDelivery,
	isFathomAiDelivery,
	releaseFathomAiDelivery,
	verifyFathomAiWebhook,
} from './types';

type Ctx = Parameters<FathomAiWebhooks['meetingContentReady']['handler']>[0];

// Core runs webhookHooks.after only after the handler returns success, passing it the same result
// object. If that hook throws, core answers with an error and Fathom retries, so the delivery's
// claim is released then (withClaimRelease) rather than turning the retry into a duplicate.
const claimByResult = new WeakMap<object, { scope: string; id: string }>();

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

			const result = {
				success: true as const,
				corsairEntityId: entity?.id,
				data: meeting,
			};
			if (deliveryId) claimByResult.set(result, { scope, id: deliveryId });
			return result;
		} catch (error) {
			if (deliveryId) releaseFathomAiDelivery(scope, deliveryId);
			throw error;
		}
	},
};

type WebhookHooks = FathomAiPluginOptions['webhookHooks'];

/** Wraps the caller's meetings.contentReady after hook so a failure in it releases the delivery's claim. */
export function withClaimRelease(hooks: WebhookHooks): WebhookHooks {
	const contentReadyHooks = hooks?.meetings?.contentReady;
	const after = contentReadyHooks?.after;
	if (!hooks || !after) return hooks;
	return {
		...hooks,
		meetings: {
			...hooks.meetings,
			contentReady: {
				...contentReadyHooks,
				after: async (ctx, response, passToAfter) => {
					try {
						await after(ctx, response, passToAfter);
					} catch (error) {
						const claim = claimByResult.get(response);
						if (claim) releaseFathomAiDelivery(claim.scope, claim.id);
						throw error;
					}
				},
			},
		},
	};
}
