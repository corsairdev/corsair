import { logEventFromContext } from 'corsair/core';
import type { CorsairWebhook, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import type { ApifyContext } from '..';
import type { ApifyWebhookOutputs, ApifyWebhookPayload } from './types';
import { verifyApifyWebhookSignature } from './types';

export const webhook: CorsairWebhook<
	ApifyContext,
	ApifyWebhookPayload,
	ApifyWebhookOutputs['webhook']
> = {
	// We intentionally accept any Apify webhook payload; callers can switch on
	// `eventType` in their own code.
	match: (request: RawWebhookRequest) => {
		const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
		return Boolean(body && typeof body === 'object' && 'eventType' in (body as any));
	},

	handler: async (
		ctx: ApifyContext,
		request: WebhookRequest<ApifyWebhookPayload>,
	) => {
		const verification = verifyApifyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Webhook authentication failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(ctx, 'apify.webhook', { ...event }, 'completed');
		return { success: true, data: event };
	},
};

